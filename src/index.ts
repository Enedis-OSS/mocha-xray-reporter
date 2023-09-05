#!/usr/bin/env node
import { Command } from 'commander';
import { isEmpty } from 'lodash';

/* A quoi sert ce fichier ? c'est pas juste du code mort ou pas fini qui ne fait rien pour l'instant ? */

// Configuration du CLI
const program = new Command();
program.option('-g, --generate', 'Generate cypress config');

program.parse(process.argv);

const options = program.opts();

if (options.generate) {
  console.log('Generating cypress configuration for xray reports');
}

if (isEmpty(options)) {
  console.log('Please precise an option. Example : -g');
}
