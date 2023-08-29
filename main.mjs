import express from "express"
import ejs from "ejs"
import cors from "cors"
import fs from "fs/promises"

import { Client } from "@concurrent-world/client";

const privateKey = process.env.CONCURRENT_PRIVATE_KEY;
const host = process.env.CONCURRENT_HOST;
const clientSig =  process.env.CONCURRENT_SIG || "concurrent-webhook-bridge";
const client = new Client(privateKey, host, clientSig);

const app = express()
app.use(cors())
app.use(express.json())
app.listen(process.env.PORT, () => console.log("Server started"))

const config = JSON.parse(process.env.CONFIG)
const webhooks = config.webhooks

webhooks.forEach(webhook => {
    app.post(webhook.path, async (req, res) => {
        try {
            const result = ejs.render(webhook.template, { body: req.body })
            await client.createCurrent(result, webhook.postStreams, {}, webhook.profileOverride);
            res.status(200).send("OK")
        } catch (error) {
            console.error(error)
            res.status(500).send("Error")
        }
    })

    console.log(`Registerd Webhook ${webhook.path}`)
})
