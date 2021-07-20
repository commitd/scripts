#!/usr/bin/env python3

import os
import datetime
import sys
from office365.runtime.auth.client_credential import ClientCredential
from office365.sharepoint.client_context import ClientContext

# Size to upload, default to 1mb (I think it might need to be less than 2mb)
size_chunk = 1000000

def connect_to_sharepoint(url, clientId, clientSecret):
    client_credentials = ClientCredential(clientId, clientSecret)
    ctx = ClientContext(url).with_credentials(client_credentials)
    return ctx

def upload_local_file(local_file, remote_folder):
    global size_chunk
    file_size = os.path.getsize(local_file)

    def print_upload_progress(offset):
        print("\tUploaded '{0}' bytes from '{1}'...[{2}%]".format(offset, file_size, round(offset / file_size * 100, 2)))

    print('Uploading {0}'.format(local_file))
    uploaded_file = remote_folder.files.create_upload_session(local_file, size_chunk, print_upload_progress).execute_query()
    print('\tSaved to {}'.format(uploaded_file.serverRelativeUrl))

def upload_local_files(local_dir, local_files, upload_folder_url):
    for local_file in local_files:
        remote_file = os.path.relpath(local_file, local_dir)
        relative_remote_dir = os.path.dirname(remote_file)

        remote_folder_url = "{}/{}".format(upload_folder_url, relative_remote_dir, relative_remote_dir)
        remote_folder = ctx.web.ensure_folder_path(remote_folder_url).execute_query()

        upload_local_file(local_file, remote_folder)

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description='Upload to Sharepoint.')
    parser.add_argument('dir', type=str, help='Directory of files to upload')
    parser.add_argument('--files', type=str, help='Glob pattern to limit to specific file patterns. Put in "", e.g "*.ts" otherwise bash will expand it', default='**/*.*')
    parser.add_argument('--name', type=str, help='Name suffix for upload directory', default='')
    parser.add_argument('--root', type=str, help='Root directory to upload to', default='Incoming')
    parser.add_argument('--site', type=str, help='Site to upload to - app must be installed with permissions already!', default='External')
    parser.add_argument('--library', type=str, help='Document library (List) to upload to - as shown in URL', default='Shared Documents')
    parser.add_argument('--clientId', type=str, help='Client Id, or pulled from CLIENT_ID environment variable ', default='')
    parser.add_argument('--clientSecret', type=str, help='Client Secret, or pulled from CLIENT_SECRET environment variable', default='')
    parser.add_argument('--organisation', type=str, help='MS365 Organisation ie committedio from https://committedio.sharepoint.com', default='committedio')

    args = parser.parse_args()
    clientId = args.clientId or os.environ.get('CLIENT_ID')
    clientSecret = args.clientSecret or os.environ.get('CLIENT_SECRET')

    if not clientId or not clientSecret:
        print("Providing clientId and clientSecret as arguments OR environment variables CLIENT_ID and CLIENT_SECRET is required")
        sys.exit(1)

    ctx = connect_to_sharepoint("https://{}.sharepoint.com/sites/{}".format(args.organisation, args.site), clientId, clientSecret)

    upload_folder_name = datetime.datetime.now().strftime("%Y%m%d%H%m%S")
    if args.name: 
        upload_folder_name += "-{}".format(args.name) 
    upload_folder_url = "/{}/{}/{}".format(args.library, args.root, upload_folder_name)
    print("Uploading all files to {}".format(upload_folder_url))

    import glob
    abs_local_dir = os.path.abspath(args.dir)
    local_files = glob.glob(os.path.join(abs_local_dir, args.files), recursive=True)
    print("Found {} files to upload".format(len(local_files))) 
    
    abs_local_files = [os.path.abspath(f) for f in local_files]
    upload_local_files(abs_local_dir, abs_local_files, upload_folder_url)
