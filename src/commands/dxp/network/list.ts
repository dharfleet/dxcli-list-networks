    import { flags, SfdxCommand } from '@salesforce/command';
    import { Messages, SfdxError } from '@salesforce/core';
    import { AnyJson } from '@salesforce/ts-types';
    import { ExecException } from 'child_process';

    // Initialize Messages with the current plugin directory
    Messages.importMessagesDirectory(__dirname);

    // Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
    // or any library that is using the messages framework can also be loaded this way.
    const messages = Messages.loadMessages('dxp', 'org');

    export default class Org extends SfdxCommand {

    public static description = messages.getMessage('commandDescription');

    public static examples = [

        'List all Networks in the Org: $ sfdx dxp:network:list -u <org alias> ',
        'List all Networks in the Org with \'Live\' status: $ sfdx dxp:network:list --status live -u <org alias> ',
        'List all Networks in the Org with \'UnderConstruction\' status: $ sfdx dxp:network:list --status building -u <org alias> ',
        'List all Networks in the Org with \'DownForMaintenance\' status: $ sfdx dxp:network:list --status down -u <org alias> ',
    ];

    public static args = [{name: 'file'}];

    protected static flagsConfig = {
        status: flags.enum({
            description: 'status of Network',
            options: ['live', 'building', 'down']
        })

    };

    // Comment this out if your command does not require an org username
    protected static requiresUsername = true;

    // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
    protected static requiresProject = false;


    public async run(): Promise<AnyJson> {
    
        const statusFlag = this.flags.status;
        //this.logger.debug('statusFlag',statusFlag);

        const fromClause = 'SELECT Id, Name, Status, UrlPathPrefix FROM Network';
        let whereClause = '';


        if(statusFlag){
            whereClause = ' WHERE Status = \'';
            if(statusFlag == 'live'){
                whereClause += 'LIVE\'';
            }
            else if(statusFlag == 'building'){
                whereClause += 'UnderConstruction\'';
            }
            else if(statusFlag == 'down'){
                whereClause += 'DownForMaintenance\'';
            }
        }

        const query = fromClause+whereClause+' ORDER BY Name';
        //this.logger.debug('Network Query', query);
        

        interface Network {
            Id: string;
            Name: string;
            Status: string;
            UrlPathPrefix: string;
        }

        let queryResult;

        try{
            queryResult = await this.org.getConnection().query<Network>(query);
        }
        catch(e){
            let errorMessage = (e as ExecException).message;
            if(errorMessage.includes('\'Network\' is not supported')){
                throw new SfdxError(messages.getMessage('communitiesNotEnabled', [this.org.getOrgId()]));
            }
        }
       

        if (!queryResult.records || queryResult.records.length <= 0) {
            throw new SfdxError(messages.getMessage('errorNoOrgResults', [this.org.getOrgId()]));
        }

        //const columns = ['Id', 'Name', 'Status', 'UrlPathPrefix'];
        const tableColumnData = { columns : [
            
            { key: 'Name', label: 'Name' },
            { key: 'Status', label: 'Status' },
            { key: 'UrlPathPrefix', label: 'URL path prefix'},
            { key: 'Id', label: 'Network Id' }
        ]};
    
        this.ux.table(queryResult.records, tableColumnData);
        

        // Return an object to be displayed with --json
        return { networks:queryResult.records };


        }
    }
