import { putOnDynamoTable, getDynamoClient } from './aws.mjs';
import { logFactory } from 'pretty-js-log';
import { getSecretManagerClient, getSecret } from './aws.mjs';
import { randomUUID } from 'node:crypto';
import { encrypt, generateApiKey, hashKey } from './crypto.mjs';

const logger = logFactory({
    id: process.pid,
});

export async function setup({ 
    awsCredentials: {
        awsAccessKeyId,
        awsSecretAccessKey,
        awsRegion 
    }, 
    titvo: { 
        titvoUserTableName, 
        titvoUserName, 
        titvoApiKeyTableName, 
        titvoConfigurationTableName,
        secretManagerSecretName, 
        openAiApiKey, 
        securityScanJobQueueName, 
        reportHtmlTemplate, 
        taskEndpoint, 
        reportBucketName, 
        reportBucketDomain, 
        securityScanJobDefinition,
        scanSystemPrompt,
        openAiModel,
        cliFilesBucketName,
    } }) {
    logger.info(`Configurando Titvo...`);
    const secretManagerClient = getSecretManagerClient({ credentials: { accessKeyId: awsAccessKeyId, secretAccessKey: awsSecretAccessKey, region: awsRegion } });
    const encodedKey = await getSecret(secretManagerClient, secretManagerSecretName);
    const dynamoClient = getDynamoClient({ credentials: { accessKeyId: awsAccessKeyId, secretAccessKey: awsSecretAccessKey, region: awsRegion } });
    const user_id = randomUUID();
    await putOnDynamoTable(dynamoClient, titvoUserTableName, {
        user_id,
        account_type: 'Team',
        name: titvoUserName,
    });
    logger.info(`Cargando tabla de claves de API: ${titvoApiKeyTableName}`);
    const apiKey = generateApiKey();
    await putOnDynamoTable(dynamoClient, titvoApiKeyTableName, {
        key_id: randomUUID(),
        api_key: hashKey(apiKey),
        user_id,
    });

    logger.info(`Cargando tabla de configuración: ${titvoConfigurationTableName}`);
    await putOnDynamoTable(dynamoClient, titvoConfigurationTableName, {
        parameter_id: 'open_ai_model',
        value: openAiModel,
    });
    logger.info(`Cargando bucket de archivos CLI: ${cliFilesBucketName}`);
    await putOnDynamoTable(dynamoClient, titvoConfigurationTableName, {
        parameter_id: 'cli_files_bucket_name',
        value: cliFilesBucketName,
    });
    logger.info(`Cargando clave de API de OpenAI: ${openAiApiKey.slice(0, 4)}...${openAiApiKey.slice(-4)}`);
    await putOnDynamoTable(dynamoClient, titvoConfigurationTableName, {
        parameter_id: 'open_ai_api_key',
        value: encrypt(openAiApiKey, encodedKey),
    });
    logger.info(`Cargando prompt de sistema:\n${scanSystemPrompt}`);
    await putOnDynamoTable(dynamoClient, titvoConfigurationTableName, {
        parameter_id: 'scan_system_prompt',
        value: scanSystemPrompt,
    });
    logger.info(`Cargando cola de jobs de seguridad: ${securityScanJobQueueName}`);
    await putOnDynamoTable(dynamoClient, titvoConfigurationTableName, {
        parameter_id: 'security-scan-job-queue',
        value: securityScanJobQueueName,
    });
    logger.info(`Cargando plantilla de HTML de reporte:\n${reportHtmlTemplate}`);
    await putOnDynamoTable(dynamoClient, titvoConfigurationTableName, {
        parameter_id: 'report_html_template',
        value: reportHtmlTemplate,
    });
    await putOnDynamoTable(dynamoClient, titvoConfigurationTableName, {
        parameter_id: 'task_endpoint',
        value: taskEndpoint,
    });
    logger.info(`Cargando bucket de reportes: ${reportBucketName}`);
    await putOnDynamoTable(dynamoClient, titvoConfigurationTableName, {
        parameter_id: 'report_bucket_name',
        value: reportBucketName,
    });
    logger.info(`Cargando dominio del bucket de reportes: ${reportBucketDomain}`);
    await putOnDynamoTable(dynamoClient, titvoConfigurationTableName, {
        parameter_id: 'report_bucket_domain',
        value: reportBucketDomain,
    });
    logger.info(`Cargando definición de job de seguridad: ${securityScanJobDefinition}`);
    await putOnDynamoTable(dynamoClient, titvoConfigurationTableName, {
        parameter_id: 'security-scan-job-definition',
        value: securityScanJobDefinition,
    });
    logger.info('Configuración completada');
    logger.info(`Clave de API: ${apiKey}`);
    logger.info(`Usuario: ${user_id}`);
}