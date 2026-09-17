type DadoProps = {
  valor: number;
};

export default function Dado({ valor }: DadoProps) {
  const valorSeguro =
    Number.isInteger(valor) && valor >= 1 && valor <= 6 ? valor : 1;

  return (
    <img
      src={`/dados/dado${valorSeguro}.png`}
      alt={`Dado mostrando o número ${valorSeguro}`}
      width={72}
      height={72}
    />
  );
}