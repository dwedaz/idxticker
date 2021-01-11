#!/bin/sh
price="./idx -c $1 -f price"
price=$($price)
if [price < $2] 
    then
    msg="$1 is Lower than $2" 
    notify-send $msg
fi
    

