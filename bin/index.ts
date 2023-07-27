#!/usr/bin/env node

import { Command } from 'commander';
import { generateRestAPI } from '../commands';
import select, { Separator } from '@inquirer/select';
import { getDomainName, getExcelPath, getInputType } from './application';

const program = new Command();

program.name('ddd-gen').description('DDD-GENERATOR').version('0.0.1-alpha');
program
    .command('generate')
    .description('Generate code file for DDD of penta ')
    .argument('<path-to-aggregate>', 'path to aggregate model. Accept excel only')
    .option('-d, --domain-name <domainName>')
    .action((path, options) => {
        generateRestAPI(path, options);
    });
program.command('start').action(async () => {
    const inputType = await getInputType();
    if (inputType === 'excel') {
        const path = await getExcelPath();
        const domainName = await getDomainName();
        const options = {
            domainName,
        };

        generateRestAPI(path, options);
    }
});

program.parse();
