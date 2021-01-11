#!/bin/sh
price="/home/willy/.npm-global/bin/idx -c $1 -f price"
price=$($price)
operator=$2
operand=$3
if [[ $price -ne "" ]]
  then
  if [[ "$operator" == "<" &&  "$price" -lt "$operand" ]]
      then
        msg="$1 ($price) is Lower than $operand" 
      sudo -u willy DISPLAY=:0 DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/1000/bus notify-send 'IDX Thicker' "$msg" -t 5000
  fi
      
  if [[ "$operator" == ">" &&  "$price" -gt "$operand" ]]
      then
        msg="$1 ($price) is More than $operand" 
      sudo -u willy DISPLAY=:0 DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/1000/bus notify-send 'IDX Thicker' "$msg" -t 5000
  fi
  if [[ "$operator" == "=" &&  "$price" -eq "$operand" ]]
      then
        msg="$1 ($price) is Equal to  $operand" 
      sudo -u willy DISPLAY=:0 DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/1000/bus notify-send 'IDX Thicker' "$msg" -t 5000
  fi
fi
