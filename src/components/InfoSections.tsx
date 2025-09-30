export default function InfoSections() {
  return (
    <section className="bg-black border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="border border-zinc-800 p-6 bg-zinc-900/50">
          <h3 className="text-lg font-semibold text-white mb-2">Use Cases</h3>
          <ul className="list-disc pl-5 text-sm text-zinc-400 space-y-1">
            <li>Generate JWT secrets for development and staging</li>
            <li>Create API keys with custom prefixes for testing</li>
            <li>Produce RSA/ECDSA keypairs for local TLS experiments</li>
            <li>Generate SSH keys for containers and CI environments</li>
          </ul>
        </div>
        <div className="border border-zinc-800 p-6 bg-zinc-900/50">
          <h3 className="text-lg font-semibold text-white mb-2">Security Best Practices</h3>
          <ul className="list-disc pl-5 text-sm text-zinc-400 space-y-1">
            <li>Never share private keys or commit them to version control</li>
            <li>Rotate secrets regularly and use environment variables</li>
            <li>Use sufficient key sizes (RSA ≥ 2048, ECDSA P-256+)</li>
            <li>Protect SSH private keys with a passphrase where possible</li>
          </ul>
        </div>
      </div>
    </section>
  );
}


