import * as dotenv from 'dotenv';
dotenv.config();
import * as cdk from 'aws-cdk-lib';
import { DynamoStack } from '../lib/dynamo-stack';
import { ApiStack } from '../lib/api-stack';
import { AuthStack } from '../lib/auth-stack';
import { FrontendStack } from '../lib/frontend-stack';
import { MonitoringStack } from '../lib/monitoring-stack';

const app = new cdk.App();
const envName = app.node.tryGetContext('env') || 'dev';
const env = { account: '142783957672', region: 'us-east-1' };

const authStack = new AuthStack(app, `RenewixAuthStack-${envName}`, {
  env,
});

const dataStack = new DynamoStack(app, `RenewixDataStack-${envName}`, {
  tableName: `RenewixTable-${envName}`,
  env,
});

const apiStack = new ApiStack(app, `RenewixApiStack-${envName}`, {
  table: dataStack.table,
  userPool: authStack.userPool,
  userPoolClient: authStack.userPoolClient,
  env,
});

new FrontendStack(app, `RenewixFrontendStack-${envName}`, {
  env,
});

new MonitoringStack(app, `RenewixMonitoringStack-${envName}`, {
  httpApi: apiStack.httpApi,
  env,
});

app.synth();
