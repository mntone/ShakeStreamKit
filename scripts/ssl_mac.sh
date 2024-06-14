#!/bin/bash

HOSTNAME='localhost'

ENVFILE='../.env'
ENVLOCAL_FILE='../.env.local'

DEVDIR='./.dev'
SSLDIR="$DEVDIR/ssl"

# Check mkcert
if ! brew ls --versions mkcert > /dev/null; then
	brew install mkcert --dry-run
	mkcert -install
fi

# Check directories
if [ ! -d .$DEVDIR ]; then
	mkdir .$DEVDIR
fi
if [ ! -d .$SSLDIR ]; then
	mkdir .$SSLDIR
fi

# Create SSL server certificate
mkcert $HOSTNAME

# Move files
mv "$HOSTNAME.pem" ".$SSLDIR/$HOSTNAME.crt"
mv "$HOSTNAME-key.pem" ".$SSLDIR/$HOSTNAME.key"

# Copy `.env` if not exists
if [ ! -e $ENVLOCAL_FILE ]; then
	cp $ENVFILE $ENVLOCAL_FILE
fi

# Write SSL files
echo "SERVER_SSLCERT=$SSLDIR/$HOSTNAME.crt" > $ENVLOCAL_FILE
echo "SERVER_SSLKEY=$SSLDIR/$HOSTNAME.key"  >> $ENVLOCAL_FILE
