#!/bin/bash

FILE=~/.counter

if [ ! -f "$FILE" ];
then
    echo 0 > $FILE
fi

C=$(($(cat $FILE)+1)) 

echo $C > $FILE

OUTPUT=$(notify-send "Counter incremented" $C -A reset='Reset counter')

if [ "$OUTPUT" == "reset" ]
then
    rm $FILE
    notify-send "Counter has been reset"
fi

