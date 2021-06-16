const express = require("express");
const { google } = require("googleapis");
const fetch = require("node-fetch");

const app = express();


app.get("/teste", (req, res) => {
    fetch('https://mandic.atlassian.net/rest/api/3/search?jql=project=LESSA', {
        method: 'GET',
        headers: {
            'Authorization': `Basic ${Buffer.from(
                'mlessaribeiro@gmail.com:OwRbvMmFmFkF2s5rq34IF637'
            ).toString('base64')}`,
            'Accept': 'application/json'
        }
    })
        .then(response => {
            console.log(
                `Response: ${response.status} ${response.statusText}`
            );
            return response.text();
        })
        .then(text => res.send(text))
        .catch(err => console.error(err));
})

const bodyData = `{
    "expand":[
        "schema",
        "names"
    ],
    "jql": "project = LESSA",
    "maxResults": 15,
    "fieldsByKeys": false,
    "fields": [
      "summary",
      "status",
      "assignee",
      "statuscategorychangedate"
    ],
    "startAt": 0
}`;


app.post("/teste", (req, res) => {
    fetch('https://mandic.atlassian.net/rest/api/3/search?jql=project=LESSA', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${Buffer.from(
                'mlessaribeiro@gmail.com:OwRbvMmFmFkF2s5rq34IF637'
            ).toString('base64')}`,
            'Content-Type': 'application/json'
        },
        body: bodyData
    })
        .then(response => {
            console.log(
                `Response: ${response.status} ${response.statusText}`
            );
            return response.text();
        })

        .then(async text => {
            let result = '';
            const auth = new google.auth.GoogleAuth({
                keyFile: "credentials.json",
                scopes: "https://www.googleapis.com/auth/spreadsheets"
            });
            const client = await auth.getClient();

            const googleSheets = google.sheets({ version: "v4", auth: client });

            const spreadsheetId = "1c0s22Hwliqoix4qTUDZcNsx6zrUN3rZrLSj2ISy7QJ8"

            const metaData = await googleSheets.spreadsheets.get({
                auth,
                spreadsheetId,

            });

            const getRows = await googleSheets.spreadsheets.values.get({
                auth,
                spreadsheetId,
                range: "Demandas!A:F",

            });


            await googleSheets.spreadsheets.values.append({
                auth,
                spreadsheetId,
                range: "Demandas!B:F",
                valueInputOption: "RAW",
                resource: {
                    values: [
                        [text] // É AQUI QUE DEVERIA FAZER A ORDENÇÃO LÁ NO EXCEL
                    ]
                }
            })
            //res.send(getRows.data);
            res.send(text)
        })

        .catch(err => console.error(err));
})



app.listen(process.env.PORT || 8080, () => {
    console.log("Rodando");
})

/*https://www.googleapis.com/auth/spreadsheets */