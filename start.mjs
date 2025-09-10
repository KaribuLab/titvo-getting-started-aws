import prompt from './lib/prompt.mjs';
import { setup } from './lib/setup.mjs';

await setup({
    awsCredentials: {
        awsAccessKeyId: prompt.awsAccessKeyId,
        awsSecretAccessKey: prompt.awsSecretAccessKey,
        awsRegion: prompt.awsRegion
    },
    titvo: {
        titvoUserTableName: prompt.titvoUserTableName,
        titvoUserName: prompt.titvoUserName,
        titvoApiKeyTableName: prompt.titvoApiKeyTableName,
        titvoprompturationTableName: prompt.titvoprompturationTableName,
        secretManagerSecretName: prompt.secretManagerSecretName,
        openAiApiKey: prompt.openAiApiKey,
        securityScanJobQueueName: prompt.securityScanJobQueueName,
        reportHtmlTemplate: prompt.reportHtmlTemplate,
        taskEndpoint: prompt.taskEndpoint,
        reportBucketName: prompt.reportBucketName,
        reportBucketDomain: prompt.reportBucketDomain,
        securityScanJobDefinition: prompt.securityScanJobDefinition,
        scanSystemPrompt: prompt.scanSystemPrompt,
        titvoConfigurationTableName: prompt.titvoConfigurationTableName,
        openAiModel: prompt.openAiModel,
        cliFilesBucketName: prompt.cliFilesBucketName,
        
    }
});
