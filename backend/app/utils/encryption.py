from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives.kdf.hkdf import HKDF
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives.serialization import load_pem_public_key
from os import urandom
import msgpack

def encrypt_file_for_tee(file_data: bytes, public_key_path: str) -> tuple:
    # Load the TEE's public key
    with open(public_key_path, "rb") as f:
        public_key = load_pem_public_key(f.read())

    # Generate an ephemeral private key for ECDH
    ephemeral_private_key = ec.generate_private_key(ec.SECP256R1())

    # Perform ECDH key exchange
    shared_key = ephemeral_private_key.exchange(ec.ECDH(), public_key)

    # Derive symmetric key
    derived_key = HKDF(
        algorithm=hashes.SHA256(),
        length=32,
        salt=None,
        info=b"ecies encryption"
    ).derive(shared_key)

    # Generate and encrypt AES key
    aes_key = urandom(32)
    aes_iv = urandom(12)
    cipher = Cipher(algorithms.AES(derived_key), modes.GCM(aes_iv))
    encryptor = cipher.encryptor()
    encrypted_aes_key = encryptor.update(aes_key) + encryptor.finalize()
    aes_key_tag = encryptor.tag

    # Encrypt file data
    data_iv = urandom(12)
    data_cipher = Cipher(algorithms.AES(aes_key), modes.GCM(data_iv))
    data_encryptor = data_cipher.encryptor()
    encrypted_file_data = data_encryptor.update(file_data) + data_encryptor.finalize()
    data_tag = data_encryptor.tag

    # Get ephemeral public key bytes
    ephemeral_public_key = ephemeral_private_key.public_key().public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    )

    # Create bundle
    bundle = {
        "ephemeral_public_key": ephemeral_public_key,
        "encrypted_symmetric_key": encrypted_aes_key,
        "encrypted_file_data": encrypted_file_data,
        "aes_iv": aes_iv,
        "aes_key_tag": aes_key_tag,
        "data_iv": data_iv,
        "data_tag": data_tag,
    }

    return msgpack.packb(bundle)