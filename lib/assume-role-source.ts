/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import * as cdk from 'aws-cdk';
import AWS = require('aws-sdk');

export class AssumeRoleCredentialProviderSource implements cdk.CredentialProviderSource {
  name: string;

  constructor() {
    this.name = "Sample";
  }

  /**
   * Whether the credential provider is even online
   *
   * Guaranteed to be called before any of the other functions are called.
   */
  public async isAvailable(): Promise<boolean> {
    return true;
  }

  /**
   * Whether the credential provider can provide credentials for the given account.
   *
   * Since we are not given the mode in this method, the most we can do here is check
   * to see whether we can obtain credentials from at least one of the roles. Because of
   * this, the method could return a false positive in some cases.
   */
  public async canProvideCredentials(accountId: string): Promise<boolean> {
    return true;
  }

  /**
   * Construct a credential provider for the given account and the given access mode
   *
   * Guaranteed to be called only if canProvideCredentails() returned true at some point.
   */
  public async getProvider(accountId: string, mode: cdk.Mode): Promise<AWS.Credentials> {
    return new AWS.CredentialProviderChain([
      function () { return new AWS.ECSCredentials(); },
      function () { return new AWS.TokenFileWebIdentityCredentials(); },
      function () { return new AWS.EnvironmentCredentials('AWS'); },
      function () { return new AWS.EnvironmentCredentials('AMAZON'); },
      function () { return new AWS.EC2MetadataCredentials(); },
    ]).resolvePromise()
  }
}
