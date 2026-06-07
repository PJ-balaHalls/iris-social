'use client';

import { useState } from 'react';
import { AlertTriangle, Brain, Check, KeyRound, LockKeyhole } from 'lucide-react';
import { updateMemoryAccessQuestionsAction } from '@/lib/actions/security.actions';
import { SecurityDisclosure } from './SecurityDisclosure';
import {
  suggestedMemoryQuestions,
  type MemoryQuestion,
  type SecurityPreferences,
  type SecuritySectionKey,
} from '../_utils/securitySettings';

export function MemoryAccessPanel({
  preferences,
  questions,
  openSection,
  onOpenSectionChange,
}: {
  preferences: SecurityPreferences;
  questions: MemoryQuestion[];
  openSection: SecuritySectionKey;
  onOpenSectionChange: (section: SecuritySectionKey) => void;
}) {
  const [editing, setEditing] = useState(false);

  const questionMap = new Map(
    questions.map((question) => [question.sort_order, question]),
  );

  return (
    <section className="mt-2">
      <SecurityDisclosure
        eyebrow="Memórias"
        title="Acesso por memórias"
        description="Configure até 3 perguntas pessoais ou afetivas para uma entrada alternativa controlada."
        open={openSection === 'memories'}
        onToggle={() =>
          onOpenSectionChange(openSection === 'memories' ? '' : 'memories')
        }
      >
        <div className="grid gap-8 xl:grid-cols-[0.78fr_1.22fr]">
          <div className="rounded-[30px] border border-[#E2E7E3] bg-white/56 p-5 backdrop-blur-md xl:p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1B3A2E] text-white">
                <Brain size={20} strokeWidth={1.8} />
              </div>

              <div>
                <h3 className="text-base font-semibold text-[#1B3A2E]">
                  Não use respostas óbvias
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#747D79]">
                  Memórias de acesso devem ser íntimas, mas não públicas. Evite
                  datas, nomes fáceis, CPF, cidade natal ou informações que
                  alguém possa descobrir.
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-[24px] border border-[#E2E7E3] bg-[#FFFDF8] p-4">
              <p className="text-sm font-semibold text-[#1B3A2E]">Status</p>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-[#747D79]">Memórias configuradas</span>
                  <span className="font-semibold text-[#1B3A2E]">
                    {questions.length}/3
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-[#747D79]">Acesso por memórias</span>
                  <span className="font-semibold text-[#1B3A2E]">
                    {preferences.memory_access_enabled ? 'Ativo' : 'Desativado'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-start gap-3 rounded-[24px] border border-[#EAD8D6] bg-[#FFF3F2] p-4">
              <AlertTriangle
                size={17}
                strokeWidth={1.8}
                className="mt-0.5 shrink-0 text-[#8A3532]"
              />
              <p className="text-sm leading-6 text-[#8A3532]">
                Esta configuração prepara a base para login por memórias. A tela
                de login ainda precisa chamar essa regra para substituir ou
                complementar a senha.
              </p>
            </div>
          </div>

          <div className="rounded-[30px] border border-[#E2E7E3] bg-white/56 p-5 backdrop-blur-md xl:p-6">
            {!editing ? (
              <div>
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-base font-semibold text-[#1B3A2E]">
                    Perguntas salvas
                  </h3>

                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="rounded-full bg-[#1B3A2E] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0F1512]"
                  >
                    Configurar
                  </button>
                </div>

                <div className="mt-5 divide-y divide-[#E2E7E3]">
                  {[1, 2, 3].map((index) => {
                    const question = questionMap.get(index);

                    return (
                      <div key={index} className="flex items-start gap-4 py-4">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F2F4F3] text-sm font-semibold text-[#1B3A2E]">
                          {index}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-[#1B3A2E]">
                            {question?.question_text ||
                              'Nenhuma memória configurada'}
                          </p>
                          <p className="mt-1 text-sm text-[#747D79]">
                            {question
                              ? 'Resposta protegida por hash.'
                              : 'Adicione uma pergunta pessoal.'}
                          </p>
                        </div>

                        {question ? (
                          <Check
                            size={17}
                            strokeWidth={1.8}
                            className="mt-1 text-[#1B3A2E]"
                          />
                        ) : (
                          <LockKeyhole
                            size={17}
                            strokeWidth={1.8}
                            className="mt-1 text-[#9AA4A1]"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <form action={updateMemoryAccessQuestionsAction}>
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-base font-semibold text-[#1B3A2E]">
                    Configurar memórias
                  </h3>

                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="rounded-full border border-[#C7CFCC] bg-white px-4 py-2 text-sm font-semibold text-[#1B3A2E]"
                  >
                    Cancelar
                  </button>
                </div>

                <div className="mt-5 space-y-5">
                  {[1, 2, 3].map((index) => {
                    const question = questionMap.get(index);

                    return (
                      <div
                        key={index}
                        className="rounded-[24px] border border-[#E2E7E3] bg-[#FFFDF8] p-4"
                      >
                        <label className="block">
                          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#747D79]">
                            Pergunta {index}
                          </span>
                          <input
                            name={`question_${index}`}
                            defaultValue={
                              question?.question_text ||
                              suggestedMemoryQuestions[index - 1]
                            }
                            className="mt-3 w-full rounded-none border-0 border-b border-[#C7CFCC] bg-transparent px-0 pb-3 text-sm font-medium text-[#1B3A2E] outline-none focus:border-[#1B3A2E]"
                          />
                        </label>

                        <label className="mt-4 block">
                          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#747D79]">
                            Resposta privada
                          </span>
                          <input
                            name={`answer_${index}`}
                            type="password"
                            placeholder="Digite uma resposta difícil de adivinhar"
                            className="mt-3 w-full rounded-none border-0 border-b border-[#C7CFCC] bg-transparent px-0 pb-3 text-sm font-medium text-[#1B3A2E] outline-none focus:border-[#1B3A2E]"
                          />
                        </label>
                      </div>
                    );
                  })}
                </div>

                <button
                  type="submit"
                  className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#1B3A2E] px-5 text-sm font-semibold text-white transition hover:bg-[#0F1512]"
                >
                  <KeyRound size={15} strokeWidth={1.8} />
                  Salvar memórias
                </button>
              </form>
            )}
          </div>
        </div>
      </SecurityDisclosure>
    </section>
  );
}
