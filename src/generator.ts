import * as bip39 from 'bip39';

export function generateMassiveHash(): string {
  // Generamos palabras hasta alcanzar casi el límite de 4000 caracteres
  let massiveHash = '';
  while (massiveHash.length < 3950) {
    // Unimos las palabras sin ningún separador para que sea un solo bloque de letras
    const mnemonic = bip39.generateMnemonic(256).split(' ').join('');
    massiveHash += mnemonic;
  }
  
  // Recortamos exactamente a 3950 caracteres para dejar espacio al dominio
  // y asegurar que TODA la URL junta no supere los 4000 caracteres de límite en Telegram.
  // Al no haber separadores, no importa si la última palabra queda cortada, 
  // solo parecerán letras continuas.
  return massiveHash.substring(0, 3950);
}

export function formatUrl(url: string): string {
  let finalUrl = url.trim();
  if (!/^https?:\/\//i.test(finalUrl)) {
    finalUrl = 'https://' + finalUrl;
  }
  return finalUrl;
}
