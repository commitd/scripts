# Upload to Sharepoint

This Python script uploads a directory to SharePoint.

My preference was for a Node solution, but having I have tried various node libraries (e.g. spsave) they didn't work at the time of writing.

## Prerequisites

This requires you to create an (Oauth2) App in SharePoint for your specific site.
As far as I can see many of the URL appear hidden for this.

If you have a site `https://committedio.sharepoint.com/sites/External/Shared Documents`, visit:

- Goto https://committedio.sharepoint.com/sites/External/_layouts/15/appregnew.aspx and create a new OAuth2 App. Record the Client Id and Client Secret. The Domain can be anything committedio.sharepoint.com as the redirect can be https://committedio.sharepoint.com/redirect fake.
- Now visit https://committedio.sharepoint.com/sites/External/_layouts/15/appinv.aspx and lookup the Client Id.
- At the bottom of that page add a permission:

```xml
<AppPermissionRequests AllowAppOnlyPolicy="true">
  <AppPermissionRequest Scope="http://sharepoint/content/sitecollection" Right="FullControl" />
</AppPermissionRequests>
```

See:

- https://github.com/s-KaiNet/node-sp-auth/wiki/SharePoint%20Online%20addin%20only%20authentication
- https://docs.microsoft.com/en-us/sharepoint/dev/solution-guidance/security-apponly-azureacs

### Usage

Install the dependencies:

```bash
pip3 install -r requirements.txt
```

Ensure you have the CLIENT_ID and CLIENT_SECRET for the Sharepoint App created above:

```bash
export CLIENT_ID=...
export CLIENT_SECRET=...

# Optional You may wish to rename / link / install sharepoint-upload.py somewhere for global use.
```

Now you can run

```bash
./sharepoint-upload.py --help
```

The majority of the options are for flexibility, and not required for general use.

### Examples

```bash
# Upload eveything under dist
./sharepoint-upload.py ./dist


# Upload just tar.gz under images
./sharepoint-upload.py ./images --files "*.tar.gz"

# Upload recursives all the *.ts under src
./sharepoint-upload.py ./src --files "**/*.ts"

# Upload a PDFs, but suffix the dir nane
./sharepoint-upload.py . --files "*.pdf" --name 'final-delivery'

```
