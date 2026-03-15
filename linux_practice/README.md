# Linux Practice Assignments

This repository contains basic Linux practice exercises, organized into seven assignments.

## Assignment 1: Navigation

- Create directories: `mkdir`
- Change directory: `cd`
- Show current directory: `pwd`
- List files/directories: `ls`
- View help/manual: `man`, `ls --help`

## Assignment 2: File Editing & Text Processing

- Create files: `touch bio.txt`
- Edit with `vi`: insert (`i`), exit insert (Esc), save & quit (`:wq`)
- Search text: `grep "pattern" <file>`, exclude matches: `grep -v`
- Clear file contents: `> <filename>`

## Assignment 3: Permissions

- Create script files: `touch script.sh`
- View permissions: `ls -l`
- Change permissions: `chmod`
- Numeric modes:
  - `7` = read, write, execute (rwx)
  - `6` = read, write (rw)
  - `4` = read only (r)
- Examples: `chmod 764 file`, `chmod +x script.sh`
- Note: `777` gives full access to everyone and is unsafe.

## Assignment 4: Networking

- Show IP configuration: `ip addr show` / `ip a` (or `ipconfig` on WSL)
- Test reachability: `ping <address>`
- Test port connectivity: `telnet <address> <port>`
- Download data: `curl <url> > file.html`

## Assignment 5: Process & System Monitoring

- List processes: `ps aux`
- Disk usage: `df -h`
- Memory usage: `free -h`
- Live monitoring: `top` (dynamic), `ps` (static snapshot)

## Assignment 6: Shell Scripting Basics

- Print messages and variables: `echo`
- Show date: `date`
- Show current user: `$USER`
- Read user input: `read -p "Prompt" variable`
- Conditionals with `if` and `-lt`
- Loops with `for` (e.g., counting and printing multiplication tables)

## Assignment 7: Mini Project – Backup Script

- Check if `backup` directory exists: `[ -d "backup" ]`
- Create directory if missing: `mkdir backup`
- Copy all `.txt` files:
  - `cp *.txt backup/ 2>/dev/null` (suppress error messages)
- Log completion time:
  - `echo "Backup Completed at $(date +"%Y-%m-%d %H:%M:%S")"`
