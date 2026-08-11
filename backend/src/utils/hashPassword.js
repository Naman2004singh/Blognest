import bcrypt from "bcrypt";

const plain = process.argv[2];

if (!plain) {
    console.error('Provide a password:  node src/scripts/hashPassword.js "myPassword"');
    process.exit(1);
}

const hash = await bcrypt.hash(plain, 10);
console.log("\nBcrypt hash:\n");
console.log(hash);
console.log("");