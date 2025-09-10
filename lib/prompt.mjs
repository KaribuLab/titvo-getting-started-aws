import { input, password, select, editor } from '@inquirer/prompts';
import { stat, readFile, writeFile } from 'node:fs/promises';

const configFilePath = 'config.json'

async function existsConfig() {
    try {
        await stat(configFilePath);
        return true;
    } catch (error) {
        return false;
    }
}
let configJson;
if (await existsConfig()) {
    const configFile = await readFile(configFilePath, 'utf8');
    configJson = JSON.parse(configFile);
} else {
    const awsAccessKeyId = await input({
        message: 'AWS access key id',
    });

    const awsSecretAccessKey = await password({
        message: 'AWS secret access key',
    });

    const awsRegion = await select({
        message: 'AWS region',
        default: 'us-east-1',
        choices: [
            {
                name: 'us-east-1',
                value: 'us-east-1',
            },
        ],
    });

    const titvoUserTableName = await input({
        message: 'Titvo user table name'
    });

    const titvoUserName = await input({
        message: 'Titvo user name'
    });

    const titvoApiKeyTableName = await input({
        message: 'Titvo api key table name'
    });

    const titvoConfigurationTableName = await input({
        message: 'Titvo configuration table name'
    });

    const secretManagerSecretName = await input({
        message: 'Secret manager secret name'
    });

    const openAiModel = await input({
        message: 'OpenAI model'
    });

    const cliFilesBucketName = await input({
        message: 'CLI files bucket name'
    });

    const openAiApiKey = await password({
        message: 'OpenAI API key'
    });

    const scanSystemPrompt = await editor({
        message: 'Scan system prompt'
    });

    const securityScanJobQueueName = await input({
        message: 'Security scan job queue name'
    });

    const reportHtmlTemplate = await editor({
        message: 'Report HTML template'
    });

    const taskEndpoint = await input({
        message: 'Task endpoint'
    });

    const reportBucketName = await input({
        message: 'Report bucket name'
    });

    const reportBucketDomain = await input({
        message: 'Report bucket domain'
    });



    const securityScanJobDefinition = await input({
        message: 'Security scan job definition'
    });

    configJson = {
        awsAccessKeyId,
        awsSecretAccessKey,
        awsRegion,
        titvoUserTableName,
        titvoUserName,
        titvoApiKeyTableName,
        titvoConfigurationTableName,
        secretManagerSecretName,
        openAiModel,
        cliFilesBucketName,
        openAiApiKey,
        scanSystemPrompt,
        securityScanJobQueueName,
        reportHtmlTemplate,
        taskEndpoint,
        reportBucketName,
        reportBucketDomain,
        securityScanJobDefinition,
    }
    await writeFile(configFilePath, JSON.stringify(configJson, null, 2));
}

export default configJson
