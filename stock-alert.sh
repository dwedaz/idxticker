#!/bin/sh
price="idx -c $1 -f price"
price=$($price)
if [[ "$price" -lt "$2" ]]
    then
    msg="$1 is Lower than $2" 
    sudo -u willy DISPLAY=:0 DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/1000/bus notify-send 'IDX Thicker' "$msg" -t 5000
fi
    

