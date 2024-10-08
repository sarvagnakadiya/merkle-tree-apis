["0x53135dd60dcd92ed6541537c03f584466a20ea250f8bb5f2e91879ae1a0ac509"]

curl --location 'http://localhost:3000/create-tree' \
--header 'Content-Type: application/json' \
--data '{
"0x5B38Da6a701c568545dCfcB03FcB875f56beddC4": 100,
"0xca2d33ad5d4fd998cbed7a1b4177c4f216b340d9": 20,
"0x97861976283e6901b407D1e217B72c4007D9F64D": 50
}
'

curl --location 'http://localhost:3000/get-proof' \
--header 'Content-Type: application/json' \
--data '{
"leaf": "0xe9b7be96a0165a40088013248cfdf7f1047fb1480328de4bd7da3b0283e892ee"
}

'
