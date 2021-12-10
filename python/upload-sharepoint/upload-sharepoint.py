#!/usr/bin/env python3

import os
import datetime
import sys
from office365.runtime.auth.client_credential import ClientCredential
from office365.sharepoint.client_context import ClientContext


def connect_to_sharepoint(url, client_id, client_secret):
    client_credentials = ClientCredential(client_id, client_secret)
    ctx = ClientContext(url).with_credentials(client_credentials)
    return ctx


def upload_local_file(local_file, remote_folder, chunk_size):
    file_size = os.path.getsize(local_file)

    def print_upload_progress(offset):
        print(
            f"\tUploaded '{offset}' bytes from '{file_size}'...[{round(offset / file_size * 100, 2)}%]")

    print(f'Uploading {local_file}')
    uploaded_file = remote_folder.files.create_upload_session(
        local_file, chunk_size, print_upload_progress).execute_query()
    print(f'\tSaved to {uploaded_file.serverRelativeUrl}')


def upload_local_files(local_dir, local_files, upload_folder_url, chunk_size):
    for local_file in local_files:
        remote_file = os.path.relpath(local_file, local_dir)
        relative_remote_dir = os.path.dirname(remote_file)

        remote_folder_url = f'{upload_folder_url}/{relative_remote_dir}'
        remote_folder = ctx.web.ensure_folder_path(
            remote_folder_url).execute_query()

        upload_local_file(local_file, remote_folder, chunk_size)


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description='Upload to Sharepoint.')
    parser.add_argument('dir', type=str, help='Directory of files to upload')
    parser.add_argument(
        '--files',
        type=str,
        help='Glob pattern to limit to specific file patterns. Put in "", e.g "*.ts" otherwise bash will expand it',
        default='**/*.*')
    parser.add_argument('--name', type=str,
                        help='Name suffix for upload directory', default='')
    parser.add_argument('--root', type=str,
                        help='Root directory to upload to', default='Incoming')
    parser.add_argument(
        '--site',
        type=str,
        help='Site to upload to - app must be installed with permissions already!',
        default='External')
    parser.add_argument(
        '--library',
        type=str,
        help='Document library (List) to upload to - as shown in URL',
        default='Shared Documents')
    parser.add_argument(
        '--clientId',
        type=str,
        help='Client Id, or pulled from CLIENT_ID environment variable ',
        default='')
    parser.add_argument(
        '--clientSecret',
        type=str,
        help='Client Secret, or pulled from CLIENT_SECRET environment variable',
        default='')
    parser.add_argument(
        '--organisation',
        type=str,
        help='MS365 Organisation ie committedio from https://committedio.sharepoint.com',
        default='committedio')
    parser.add_argument(
        '--chunkSize',
        type=int,
        help='The chunksize to use when uploading',
        default=100000000)

    args = parser.parse_args()
    clientId = args.clientId or os.environ.get('CLIENT_ID')
    clientSecret = args.clientSecret or os.environ.get('CLIENT_SECRET')

    if not clientId or not clientSecret:
        print("Providing clientId and clientSecret as arguments OR environment variables CLIENT_ID and CLIENT_SECRET is required")
        sys.exit(1)

    ctx = connect_to_sharepoint(
        f'https://{args.organisation}.sharepoint.com/sites/{args.site}',
        clientId,
        clientSecret)

    upload_folder_name = datetime.datetime.now().strftime("%Y%m%d%H%m%S")
    if args.name:
        upload_folder_name += f'-{args.name}'
    upload_folder_url = f'/{args.library}/{args.root}/{upload_folder_name}'
    print(f'Uploading all files to {upload_folder_url}')

    import glob
    abs_local_dir = os.path.abspath(args.dir)
    local_files = glob.glob(os.path.join(
        abs_local_dir, args.files), recursive=True)
    print(f'Found {len(local_files)} files to upload')

    abs_local_files = [os.path.abspath(f) for f in local_files]
    upload_local_files(abs_local_dir, abs_local_files,
                       upload_folder_url, args.chunkSize)
