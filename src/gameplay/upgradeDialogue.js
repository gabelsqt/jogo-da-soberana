// Comentários de instalação; valores e efeitos ficam nas descrições técnicas.
export const UPGRADE_DIALOGUE = {
  "br": [
    "Peça boa a gente aproveita.",
    "Esse barulho agora é de serviço feito.",
    "O rojão achou emprego.",
    "Melhorou. E sem sobrar parafuso.",
    "Dá pra fazer render mais.",
    "Agora tem fôlego.",
    "Pode testar, chefe.",
    "A oficina acompanhou o crescimento.",
    "Tá pronto pra mais uma noite.",
    "Olha até onde a gente chegou."
  ],
  "us": [
    "Excelente! Um começo histórico.",
    "Maior. Eu disse que dava.",
    "Isso merece uma inauguração.",
    "Minha equipe fez um grande trabalho.",
    "A câmera vai precisar recuar.",
    "Uma melhoria espetacular.",
    "Eu sempre acreditei nesse projeto.",
    "O tamanho importa para a fotografia.",
    "Ninguém vai esquecer nosso nome.",
    "Esse resultado também tem a sua participação!"
  ],
  "ru": [
    "Equipamento pronto.",
    "Ajuste concluído. Teste a execução.",
    "Mais uma etapa.",
    "Boa base. Continue treinando.",
    "Não confunda potência com precisão.",
    "Concentre-se no próximo alvo.",
    "Agora quero ver sua melhor série.",
    "Sem desperdício de movimento.",
    "O equipamento está à altura.",
    "Agora mostre o que aprendeu."
  ],
  "cn": [
    "Separei uma solução pra você.",
    "Pedido confirmado.",
    "O estoque rendeu.",
    "Essa peça tem futuro.",
    "A escala faz diferença.",
    "Melhoria entregue. Embalagem retornável.",
    "Isso vai render um anúncio ótimo.",
    "Nada de jogar a peça antiga fora.",
    "Guarde a nota. Por organização.",
    "Olha o tamanho da nossa operação!"
  ],
  "jp": [
    "Vamos achar seu ritmo.",
    "Equipamento no palco.",
    "Essa entrada ficou melhor.",
    "A equipe acertou o tempo.",
    "Mais uma passagem de som.",
    "Pode dar o sinal.",
    "O céu vai notar a diferença.",
    "Essa parte eu ensaiei muito.",
    "Prepara o último refrão.",
    "Parceiro, olha o show que a gente montou."
  ]
};
export function upgradeRepresentativeLine(country, level) {
  return UPGRADE_DIALOGUE[country]?.[level - 1] ?? '';
}

