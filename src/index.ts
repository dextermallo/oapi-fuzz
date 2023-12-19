import * as fs from 'fs';
import { RequestRunner, OAPIParser } from './class';
import { TestCaseList } from './test';
import * as figlet from 'figlet';
import { Command } from 'commander';


const DEFAULT_SAVE_RESPONSE = false;
const DEFAULT_SAVE_PATH = 'out';
const DEFAULT_TESTCASES = TestCaseList;
const DEFAULT_PROFILE_PATH = 'data'
const APP_NAME = 'OAPI Fuzz'


async function runner() {
    // @TODO: impl url-based
    // https://stackoverflow.com/questions/29853333/importing-a-json-file-from-a-url-using-node-js-express

    const json = JSON.parse(fs.readFileSync('./data/api-docs-json.json', 'utf8'));
    const oapiPaser = new OAPIParser(json, '');
    oapiPaser.parse();
    const requestList = oapiPaser.genCustomRequestList();

    for (const request of requestList) {
        const requestRunner = new RequestRunner(
            request,
            [TestCaseList[0]],
            'data',
            true,
            'out'
        );
        await requestRunner.exec();
    }
 }

(async() => {
    // await runner();

    console.log(figlet.textSync('OAPI Fuzz'));
    
    const program = new Command();

    program
    .version('0.0.0-beta')
    .description('desc')
    .option('-i, --input [value]', 'opt desc')
    .option('-o, --output-path, [value]', 'opt2 desc')
    .parse(process.argv);

    const options = program.opts();

})();