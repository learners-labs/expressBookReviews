curl --location 'http://localhost:5000/customer/login' \
--header 'Content-Type: application/json' \
--header 'Cookie: connect.sid=s%3AN-RI2I3VPr7CIFFbGPU-0LPeplN6HjFI.jHVOLrTUuHZ6IKSyidzl9tXJw2SQxAKv%2FpxXGwnJmtc' \
--data '{
    "username": "uswer",
    "password": "password"
}'

{
    "message": "Login successful"
}