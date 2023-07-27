import { select, input, confirm } from '@inquirer/prompts';

export const getInputType = async () => {
    const answer = await select({
        message: 'Select input type',
        choices: [
            {
                name: 'excel',
                value: 'excel',
                description: 'read entity information from excel file',
            },
            {
                name: 'manual',
                value: 'manual',
                description: 'enter your en',
            },
        ],
    });

    return answer;
};

export const getExcelPath = async () => {
    const answer = await input({ message: 'Enter excel file path: ' });
    return answer;
};

export const confirmDefaultDomainName = async () => {
    const answer = await confirm({ message: 'Using aggregate name to be domain name ?' });
    return answer;
};

export const getDomainName = async () => {
    const useDefaultDomainName = await confirmDefaultDomainName();
    if (useDefaultDomainName) {
        return null;
    }

    const answer = await input({ message: 'Enter domain name: ' });
    return answer;
};
