import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';
import { logFactory } from 'pretty-js-log';

const logger = logFactory({
    id: process.pid,
});

/**
 * Crea y retorna un cliente de AWS DynamoDB
 * @param {Object} params - Parámetros de configuración
 * @param {Object} params.credentials - Credenciales de AWS
 * @param {string} params.credentials.accessKeyId - El ID de la clave de acceso
 * @param {string} params.credentials.secretAccessKey - La clave de acceso secreta
 * @param {string} params.credentials.region - La región de AWS
 * @returns {DynamoDBClient} - Cliente de DynamoDB configurado
 */
export function getDynamoClient({ credentials: { accessKeyId, secretAccessKey, region } }) {
    return new DynamoDBClient({
        region,
        credentials: {
            accessKeyId,
            secretAccessKey,
        },
    });
}

/**
 * Crea y retorna un cliente de AWS Secret Manager
 * @param {Object} params - Parámetros de configuración
 * @param {Object} params.credentials - Credenciales de AWS
 * @param {string} params.credentials.accessKeyId - El ID de la clave de acceso
 * @param {string} params.credentials.secretAccessKey - La clave de acceso secreta
 * @param {string} params.credentials.region - La región de AWS
 * @returns {SecretsManagerClient} - Cliente de Secret Manager configurado
 */
export function getSecretManagerClient({ credentials: { accessKeyId, secretAccessKey, region } }) {
    logger.info(`Secret manager region: ${region}`);
    return new SecretsManagerClient({
        region,
        credentials: {
            accessKeyId,
            secretAccessKey,
        },
    });
}

/**
 * Obtiene un secreto de AWS Secret Manager
 * @param {SecretsManagerClient} secretManagerClient - Cliente de Secret Manager
 * @param {string} secretName - Nombre del secreto a obtener
 * @returns {Promise<Object>} - El valor del secreto como objeto JSON
 */
export async function getSecret(secretManagerClient, secretName) {
    try {
        const command = new GetSecretValueCommand({
            SecretId: secretName,
        });
        
        const response = await secretManagerClient.send(command);
        
        // El secreto puede venir como string JSON o como datos binarios
        if (response.SecretString) {
            return response.SecretString;
        }
        logger.warn('El secreto no tiene SecretString');
        return null;
    } catch (error) {
        logger.error('Error al obtener el secreto:', error);
        throw error;
    }
}

/**
 * Función para insertar un item en una tabla de DynamoDB
 * @param {DynamoDBClient} dynamoClient - Cliente de DynamoDB
 * @param {string} tableName - Nombre de la tabla de DynamoDB
 * @param {Object} item - Objeto con los datos a insertar
 * @returns {Promise<Object>} - Respuesta de DynamoDB
 */
export async function putOnDynamoTable(dynamoClient, tableName, item) {
    // Convertir el objeto JavaScript a formato DynamoDB usando marshall
    const marshalledItem = marshall(item);

    // Crear el comando para insertar el item
    const command = new PutItemCommand({
        TableName: tableName,
        Item: marshalledItem,
    });

    try {
        // Ejecutar el comando
        const response = await dynamoClient.send(command);
        return response;
    } catch (error) {
        logger.error('Error al insertar en DynamoDB:', error);
        throw error;
    }
}
