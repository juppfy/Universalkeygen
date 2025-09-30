import { useState } from 'react';

interface QA {
  q: string;
  a: string;
}

const QA_ITEMS: QA[] = [
  {
    q: 'Are keys generated client-side?',
    a: 'Yes. All keys are generated in your browser using the Web Crypto API. No data is sent to any server.',
  },
  {
    q: 'Can I export in PEM/DER?',
    a: 'PEM is supported now; DER is planned. PEM outputs are compatible with OpenSSL.',
  },
  {
    q: 'Is SSH OpenSSH format supported?',
    a: 'Ed25519 public key is provided in OpenSSH format. Private PEM and RSA/ECDSA PEM are included.',
  },
  {
    q: 'Are my keys stored?',
    a: 'No. History and stats are session-only in memory and cleared on refresh.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-black border-t border-zinc-800">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-white mb-6">FAQ</h2>
        <div className="divide-y divide-zinc-800 border border-zinc-800">
          {QA_ITEMS.map((item, idx) => (
            <div key={idx}>
              <button
                className="w-full text-left px-4 py-3 hover:bg-zinc-900 text-white"
                onClick={() => setOpen(open === idx ? null : idx)}
              >
                {item.q}
              </button>
              {open === idx && (
                <div className="px-4 py-3 text-sm text-zinc-400 bg-zinc-950">{item.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


