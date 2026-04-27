import { S3Client, CreateBucketCommand, PutBucketWebsiteCommand, PutBucketPolicyCommand, PutObjectCommand, DeletePublicAccessBlockCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";
import mime from "mime-types";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const s3Client = new S3Client({ region: process.env.AWS_DEFAULT_REGION });
const bucketName = `flappy-kiro-prod-${Date.now()}`;
const distDir = path.join(__dirname, "dist");

async function uploadDirectory(bucketName, dirPath) {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            await uploadDirectory(bucketName, fullPath);
        } else {
            const fileContent = fs.readFileSync(fullPath);
            // Calculate relative path for the S3 Key
            const relativePath = path.relative(distDir, fullPath).replace(/\\/g, '/');
            const contentType = mime.lookup(fullPath) || 'application/octet-stream';
            
            console.log(`Uploading ${relativePath}...`);
            await s3Client.send(new PutObjectCommand({
                Bucket: bucketName,
                Key: relativePath,
                Body: fileContent,
                ContentType: contentType
            }));
        }
    }
}

async function deploy() {
    try {
        console.log(`Creating bucket: ${bucketName}`);
        await s3Client.send(new CreateBucketCommand({ Bucket: bucketName }));

        console.log("Removing Public Access Block...");
        await s3Client.send(new DeletePublicAccessBlockCommand({ Bucket: bucketName }));

        console.log("Setting Bucket Policy for public read access...");
        const bucketPolicy = {
            Version: "2012-10-17",
            Statement: [
                {
                    Sid: "PublicReadGetObject",
                    Effect: "Allow",
                    Principal: "*",
                    Action: "s3:GetObject",
                    Resource: `arn:aws:s3:::${bucketName}/*`
                }
            ]
        };
        await s3Client.send(new PutBucketPolicyCommand({
            Bucket: bucketName,
            Policy: JSON.stringify(bucketPolicy)
        }));

        console.log("Configuring Static Website Hosting...");
        await s3Client.send(new PutBucketWebsiteCommand({
            Bucket: bucketName,
            WebsiteConfiguration: {
                IndexDocument: { Suffix: "index.html" },
                ErrorDocument: { Key: "index.html" }
            }
        }));

        console.log(`Uploading contents of ${distDir}...`);
        await uploadDirectory(bucketName, distDir);

        const region = process.env.AWS_DEFAULT_REGION;
        const websiteUrl = `http://${bucketName}.s3-website-${region}.amazonaws.com`;
        
        console.log("\n=============================================");
        console.log("Deployment Complete!");
        console.log(`Production URL: ${websiteUrl}`);
        console.log("=============================================\n");

    } catch (error) {
        console.error("Error during deployment:", error);
    }
}

deploy();
