#!/bin/bash

source="$1"
target="$2"
if [ -z $source ] || [ -z $target ]
then
    echo "usage: unpack-export.sh source target"
    exit 0
fi

mv -f $source/media/* $target/media/ && \
rm -rf $source/media && \
mv -f $source/deck.json $target/ && \
rm -rf $source
