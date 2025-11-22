"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useWorkflowActions } from "@/hooks/useWorkflows";

export function BuilderSection() {
  const currentAccount = useCurrentAccount();
  const { uploadWorkflow } = useWorkflowActions();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [price, setPrice] = useState("0");
  const [workflowJson, setWorkflowJson] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleUpload = async () => {
    if (!currentAccount) {
      setMessage({ type: 'error', text: 'Please connect your wallet first' });
      return;
    }

    if (!name || !description || !workflowJson) {
      setMessage({ type: 'error', text: 'Please fill all required fields' });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      // Parse le JSON du workflow
      let parsedWorkflow;
      try {
        parsedWorkflow = JSON.parse(workflowJson);
      } catch (err) {
        throw new Error('Invalid JSON format');
      }

      // Créer le workflow complet avec les métadonnées
      const strategy = {
        ...parsedWorkflow,
        id: parsedWorkflow.id || `workflow-${Date.now()}`,
        version: parsedWorkflow.version || "1.0.0",
        meta: {
          name,
          author: currentAccount.address,
          description,
          created_at: Date.now(),
          updated_at: Date.now(),
          tags: tags.split(',').map(t => t.trim()).filter(t => t),
          price_sui: parseFloat(price) || 0,
        },
        nodes: parsedWorkflow.nodes || [],
        edges: parsedWorkflow.edges || [],
      };

      // Upload sur Walrus
      const result = await uploadWorkflow(strategy);

      setMessage({ 
        type: 'success', 
        text: `Workflow uploaded! Blob ID: ${result.metadataBlobId.slice(0, 12)}...` 
      });

      // Reset form
      setName("");
      setDescription("");
      setTags("");
      setPrice("0");
      setWorkflowJson("");
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setUploading(false);
    }
  };

  const loadExample = () => {
    const exampleWorkflow = {
      id: "example-workflow",
      version: "1.0.0",
      nodes: [
        {
          id: "node_1",
          type: "FLASH_BORROW",
          protocol: "NAVI",
          label: "Borrow SUI",
          params: {
            asset: "0x2::sui::SUI",
            amount: "1000000000"
          },
          outputs: [
            { id: "coin", type: "Coin<0x2::sui::SUI>", output_type: "COIN" },
            { id: "receipt", type: "FlashLoanReceipt", output_type: "RECEIPT" }
          ]
        },
        {
          id: "node_2",
          type: "FLASH_REPAY",
          protocol: "NAVI",
          label: "Repay SUI",
          params: {
            asset: "0x2::sui::SUI"
          },
          inputs: {
            coin_repay: "node_1.coin",
            receipt: "node_1.receipt"
          }
        }
      ],
      edges: [
        {
          id: "edge_1",
          source: "node_1",
          source_output: "coin",
          target: "node_2",
          target_input: "coin_repay",
          edge_type: "COIN",
          coin_type: "0x2::sui::SUI"
        },
        {
          id: "edge_2",
          source: "node_1",
          source_output: "receipt",
          target: "node_2",
          target_input: "receipt",
          edge_type: "RECEIPT"
        }
      ]
    };

    setWorkflowJson(JSON.stringify(exampleWorkflow, null, 2));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-6">
        <h1 className="text-4xl md:text-6xl font-pixel text-white tracking-wider">
          UPLOAD WORKFLOW
        </h1>

        {message && (
          <div className={`p-4 border-4 ${
            message.type === 'success' 
              ? 'bg-green-500/10 border-green-500/40' 
              : 'bg-red-500/10 border-red-500/40'
          }`}>
            <p className="text-white font-pixel text-sm">{message.text}</p>
          </div>
        )}

        <div className="pt-8 space-y-6">
          <div className="bg-walrus-mint/10 border-4 border-walrus-mint/40 p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-walrus-mint font-pixel text-sm mb-2">
                  NAME *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black/50 border-2 border-walrus-mint/40 p-3 text-white font-mono focus:border-walrus-mint outline-none"
                  placeholder="My Awesome Workflow"
                />
              </div>

              <div>
                <label className="block text-walrus-mint font-pixel text-sm mb-2">
                  DESCRIPTION *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-black/50 border-2 border-walrus-mint/40 p-3 text-white font-mono focus:border-walrus-mint outline-none h-24"
                  placeholder="A brief description of your workflow..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-walrus-mint font-pixel text-sm mb-2">
                    TAGS (comma separated)
                  </label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full bg-black/50 border-2 border-walrus-mint/40 p-3 text-white font-mono focus:border-walrus-mint outline-none"
                    placeholder="arbitrage, defi, sui"
                  />
                </div>

                <div>
                  <label className="block text-walrus-mint font-pixel text-sm mb-2">
                    PRICE (SUI)
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-black/50 border-2 border-walrus-mint/40 p-3 text-white font-mono focus:border-walrus-mint outline-none"
                    placeholder="0"
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-walrus-mint font-pixel text-sm">
                    WORKFLOW JSON *
                  </label>
                  <button
                    onClick={loadExample}
                    className="px-3 py-1 bg-walrus-mint/20 border border-walrus-mint text-walrus-mint text-xs font-pixel hover:bg-walrus-mint hover:text-black transition-colors"
                  >
                    LOAD EXAMPLE
                  </button>
                </div>
                <textarea
                  value={workflowJson}
                  onChange={(e) => setWorkflowJson(e.target.value)}
                  className="w-full bg-black/50 border-2 border-walrus-mint/40 p-3 text-white font-mono focus:border-walrus-mint outline-none h-64 text-sm"
                  placeholder='{"nodes": [...], "edges": [...]}'
                />
              </div>

              <button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full px-6 py-4 bg-walrus-mint/20 border-4 border-walrus-mint hover:bg-walrus-mint hover:text-black transition-colors font-pixel text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'UPLOADING TO WALRUS...' : 'UPLOAD WORKFLOW'}
              </button>
            </div>
          </div>

          <div className="bg-walrus-mint/10 border-4 border-walrus-mint/40 p-6">
            <h3 className="text-walrus-mint font-pixel text-lg mb-4">ℹ️ HOW IT WORKS</h3>
            <ul className="text-white/80 text-sm font-mono space-y-2 list-disc list-inside">
              <li>Your workflow is encrypted using Seal IBE</li>
              <li>Encrypted data is stored on Walrus decentralized storage</li>
              <li>Only buyers can decrypt and access your workflow</li>
              <li>You earn SUI when someone purchases your workflow</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
