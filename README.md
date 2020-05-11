TO INSTALL:

At command line type:

sfdx plugins:install https://https://github.com/dharfleet/dxcli-list-networks.git

then:

sfdx plugins:link $HOME/.local/share/sfdx/node_modules/dxp



USAGE
  $ sfdx dxp:network:list [-status <live|building|down>] [-f] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]


OPTIONS
  -f, --force                                                                       example boolean flag
  -n, --name=name                                                                   name to print

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  -v, --targetdevhubusername=targetdevhubusername                                   username or alias for the dev hub
                                                                                    org; overrides default dev hub org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLES
List all Networks in the Org:
$ sfdx dxp:network:list -u <org alias> ',
List all Networks in the Org with 'Live' status:
$ sfdx dxp:network:list --status live -u <org alias> ',
List all Networks in the Org with 'UnderConstruction' status:
$ sfdx dxp:network:list --status building -u <org alias> ',
List all Networks in the Org with 'DownForMaintenance' status:
$ sfdx dxp:network:list --status down -u <org alias> '