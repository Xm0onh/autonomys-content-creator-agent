from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives.kdf.hkdf import HKDF
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
import msgpack
import logging

logger = logging.getLogger(__name__)

def decrypt_tee_file(encrypted_file_path: str, private_key_path: str, output_file_path: str) -> bool:
    """
    Decrypt a file that was encrypted for TEE processing
    
    Args:
        encrypted_file_path: Path to the encrypted MessagePack bundle
        private_key_path: Path to the TEE's private key
        output_file_path: Where to save the decrypted file
        
    Returns:
        bool: True if decryption was successful
    """
    try:
        # Load the TEE's private ECC key
        with open(private_key_path, "rb") as f:
            private_key = serialization.load_pem_private_key(f.read(), password=None)

        # Load the encrypted bundle using MessagePack
        with open(encrypted_file_path, "rb") as f:
            bundle = msgpack.unpackb(f.read())

        # Extract data from the bundle
        ephemeral_public_key = serialization.load_pem_public_key(bundle["ephemeral_public_key"])
        encrypted_symmetric_key = bundle["encrypted_symmetric_key"]
        aes_iv = bundle["aes_iv"]
        aes_key_tag = bundle["aes_key_tag"]
        encrypted_file_data = bundle["encrypted_file_data"]
        data_iv = bundle["data_iv"]
        data_tag = bundle["data_tag"]

        # Perform ECDH to derive the shared secret
        shared_key = private_key.exchange(ec.ECDH(), ephemeral_public_key)

        # Derive the symmetric key from the shared secret using HKDF
        derived_key = HKDF(
            algorithm=hashes.SHA256(),
            length=32,
            salt=None,
            info=b"ecies encryption"
        ).derive(shared_key)

        # Decrypt the AES symmetric key
        aes_cipher = Cipher(algorithms.AES(derived_key), modes.GCM(aes_iv, aes_key_tag))
        aes_decryptor = aes_cipher.decryptor()
        aes_symmetric_key = aes_decryptor.update(encrypted_symmetric_key) + aes_decryptor.finalize()

        # Decrypt the file data
        data_cipher = Cipher(algorithms.AES(aes_symmetric_key), modes.GCM(data_iv, data_tag))
        data_decryptor = data_cipher.decryptor()
        decrypted_file_data = data_decryptor.update(encrypted_file_data) + data_decryptor.finalize()

        # Save the decrypted file
        with open(output_file_path, "wb") as f:
            f.write(decrypted_file_data)

        return True

    except Exception as e:
        logger.error(f"Error during TEE file decryption: {str(e)}")
        return False