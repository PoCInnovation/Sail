"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import type { Strategy } from "@/hooks/useWorkflows";

export function TemplatesSection() {
  const currentAccount = useCurrentAccount();
  const [templates, setTemplates] = useState<Strategy[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Strategy | null>(null);

  useEffect(() => {
    // Charger les workflows depuis localStorage
    const loadTemplates = () => {
      const stored = localStorage.getItem('purchased_workflows');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          
          // Normaliser les données au cas où certaines ont le wrapper { workflow: ... }
          const normalized = parsed.map((item: any) => {
            // Si l'item a une propriété 'workflow', extraire le workflow
            if (item.workflow && !item.meta) {
              return item.workflow;
            }
            return item;
          });
          
          setTemplates(normalized);
          
          // Sauvegarder la version normalisée si nécessaire
          if (JSON.stringify(normalized) !== JSON.stringify(parsed)) {
            localStorage.setItem('purchased_workflows', JSON.stringify(normalized));
          }
        } catch (err) {
          console.error('Failed to parse templates:', err);
        }
      }
    };

    loadTemplates();

    // Écouter les changements de localStorage
    const handleStorageChange = () => {
      loadTemplates();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleDelete = (workflowId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this template?');
    if (!confirmed) return;

    const filtered = templates.filter(t => t.id !== workflowId);
    setTemplates(filtered);
    localStorage.setItem('purchased_workflows', JSON.stringify(filtered));
    
    if (selectedTemplate?.id === workflowId) {
      setSelectedTemplate(null);
    }
  };

  const handleUseTemplate = (template: Strategy) => {
    // Copier le workflow dans le presse-papier
    const workflowJson = JSON.stringify(template, null, 2);
    navigator.clipboard.writeText(workflowJson);
    alert('Template copied to clipboard!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-6">
        <h1 className="text-4xl md:text-6xl font-pixel text-white tracking-wider">
          MY TEMPLATES
        </h1>

        <div className="pt-8">
          {templates.length === 0 ? (
            <div className="bg-walrus-mint/10 border-4 border-walrus-mint/40 p-8">
              <p className="text-white font-pixel text-sm mb-4">
                NO TEMPLATES YET
              </p>
              <p className="text-white/60 text-xs font-mono">
                Purchase workflows from the marketplace to add them to your templates.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Liste des templates */}
              <div className="space-y-4">
                {templates.map((template) => {
                  // Vérifier que le template a une structure valide
                  if (!template?.meta) {
                    console.warn('Invalid template structure:', template);
                    return null;
                  }
                  
                  return (
                    <motion.div
                      key={template.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedTemplate(template)}
                      className={`bg-walrus-mint/10 border-4 p-6 cursor-pointer transition-all ${
                        selectedTemplate?.id === template.id
                          ? 'border-walrus-mint'
                          : 'border-walrus-mint/40 hover:border-walrus-mint/80'
                      }`}
                    >
                      <h3 className="text-2xl font-pixel text-walrus-mint mb-2">
                        {template.meta.name}
                      </h3>
                      
                      <p className="text-white/80 text-sm font-mono mb-3">
                        {template.meta.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {template.meta.tags?.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-walrus-mint/20 border border-walrus-mint/40 text-walrus-mint text-xs font-pixel"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-walrus-mint/20">
                        <span className="text-white/60 text-xs font-mono">
                          {template.nodes?.length || 0} nodes • {template.edges?.length || 0} edges
                        </span>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUseTemplate(template);
                            }}
                          className="px-3 py-1 bg-walrus-mint/20 border border-walrus-mint text-walrus-mint text-xs font-pixel hover:bg-walrus-mint hover:text-black transition-colors"
                        >
                          COPY
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(template.id);
                          }}
                          className="px-3 py-1 bg-red-500/20 border border-red-500 text-red-500 text-xs font-pixel hover:bg-red-500 hover:text-white transition-colors"
                        >
                          DELETE
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
                })}
              </div>

              {/* Détails du template sélectionné */}
              <div className="lg:sticky lg:top-6 h-fit">
                {selectedTemplate ? (
                  <div className="bg-walrus-mint/10 border-4 border-walrus-mint p-6">
                    <h3 className="text-xl font-pixel text-walrus-mint mb-4">
                      TEMPLATE DETAILS
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <p className="text-walrus-mint/80 text-xs font-pixel mb-1">
                          AUTHOR
                        </p>
                        <p className="text-white text-sm font-mono break-all">
                          {selectedTemplate.meta.author}
                        </p>
                      </div>

                      <div>
                        <p className="text-walrus-mint/80 text-xs font-pixel mb-1">
                          VERSION
                        </p>
                        <p className="text-white text-sm font-mono">
                          {selectedTemplate.version}
                        </p>
                      </div>

                      <div>
                        <p className="text-walrus-mint/80 text-xs font-pixel mb-1">
                          CREATED
                        </p>
                        <p className="text-white text-sm font-mono">
                          {new Date(selectedTemplate.meta.created_at).toLocaleString()}
                        </p>
                      </div>

                      <div>
                        <p className="text-walrus-mint/80 text-xs font-pixel mb-2">
                          NODES ({selectedTemplate.nodes.length})
                        </p>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {selectedTemplate.nodes.map((node: any) => (
                            <div
                              key={node.id}
                              className="bg-black/50 border border-walrus-mint/40 p-2"
                            >
                              <p className="text-walrus-mint text-xs font-pixel">
                                {node.label || node.id}
                              </p>
                              <p className="text-white/60 text-xs font-mono">
                                {node.type} • {node.protocol}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => handleUseTemplate(selectedTemplate)}
                        className="w-full px-4 py-3 bg-walrus-mint/20 border-2 border-walrus-mint hover:bg-walrus-mint hover:text-black transition-colors font-pixel text-sm"
                      >
                        COPY TO CLIPBOARD
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-walrus-mint/10 border-4 border-walrus-mint/40 p-8">
                    <p className="text-white/60 font-pixel text-sm text-center">
                      SELECT A TEMPLATE TO VIEW DETAILS
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
