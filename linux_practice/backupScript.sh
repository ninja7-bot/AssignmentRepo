if [ -d "backup" ]; then
    echo "Directory already exists"
else
    mkdir backup
    echo "Backup directory created"
fi

cp *.txt backup/ 2>/dev/null

echo "Backup Completed at $(date +"%Y-%m-%d %H:%M:%S")"
