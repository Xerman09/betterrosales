import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Folders to skip
EXCLUDE_DIRS = {'.git', 'node_modules', 'dist', '.vscode'}

# File extensions to process
EXTENSIONS = {'.html', '.js', '.jsx', '.ts', '.tsx', '.json', '.md', '.txt', '.xml', '.webmanifest', '.yml', '.yaml', '.sh'}

REPLACEMENTS = [
    # Full URLs & domains
    ("https://github.com/BetterSolano/bettersolano", "https://github.com/Xerman09/betterrosales"),
    ("https://bettersolano.org", "https://betterrosales.org"),
    ("http://bettersolano.org", "https://betterrosales.org"),
    ("quiz.bettersolano.org", "quiz.betterrosales.org"),
    ("bettersolano.org", "betterrosales.org"),
    ("BetterSolano.org", "BetterRosales.org"),
    ("BetterSolano", "BetterRosales"),
    ("bettersolano", "betterrosales"),

    # Emails
    ("lgusolanonv@gmail.com", "iloverosales@gmail.com"),
    ("volunteer@bettersolano.org", "volunteer@betterrosales.org"),

    # Municipal domain & portal links
    ("sangguniangbayan.solano.gov.ph", "pangasinan.gov.ph"),
    ("solano.gov.ph", "rosales.gov.ph"),
    ("solanomayorsoffice-oasys.com", "rosales.gov.ph"),

    # Full location phrases
    ("Solano, Nueva Vizcaya, Philippines", "Rosales, Pangasinan, Philippines"),
    ("Solano, Nueva Vizcaya", "Rosales, Pangasinan"),
    ("Solano, Pangasinan", "Rosales, Pangasinan"),
    ("Municipality of Solano", "Municipality of Rosales"),
    ("Bayang Tagapangasiwa ng Solano", "Bayang Tagapangasiwa ng Rosales"),
    ("Lungsod/Bayan ng Solano", "Bayan ng Rosales"),
    ("LGU Solano", "LGU Rosales"),
    ("lgu solano", "lgu rosales"),
    ("people of Solano", "people of Rosales"),
    ("mamamayan ng Solano", "mamamayan ng Rosales"),
    ("tattao ti Solano", "tattao ti Rosales"),
    ("Solano Municipal Hall", "Rosales Municipal Hall"),
    ("Solano Public Market", "Rosales Public Market"),
    ("Solano District Jail", "Rosales Municipal Jail"),
    ("Solano Fire Station", "Rosales Fire Station"),
    ("Solano Police Station", "Rosales Police Station"),

    # Province
    ("Nueva Vizcaya", "Pangasinan"),
    ("nueva-vizcaya", "pangasinan"),
    ("nueva vizcaya", "pangasinan"),

    # Standalone municipality name
    ("Solano", "Rosales"),
]

total_files_changed = 0
total_replacements = 0

for dirpath, dirnames, filenames in os.walk(ROOT):
    # filter directories in-place
    dirnames[:] = [d for d in dirnames if d not in EXCLUDE_DIRS]
    
    for filename in filenames:
        ext = os.path.splitext(filename)[1].lower()
        if ext not in EXTENSIONS and filename not in {'.htaccess', '.env.example'}:
            continue
        
        filepath = os.path.join(dirpath, filename)
        
        # skip this script itself
        if os.path.abspath(filepath) == os.path.abspath(__file__):
            continue
            
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
        except UnicodeDecodeError:
            try:
                with open(filepath, 'r', encoding='latin-1') as f:
                    content = f.read()
            except Exception as e:
                print(f"Skipping {filepath}: {e}")
                continue
        except Exception as e:
            print(f"Skipping {filepath}: {e}")
            continue

        new_content = content
        file_replacements = 0
        for old, new in REPLACEMENTS:
            if old in new_content:
                count = new_content.count(old)
                file_replacements += count
                new_content = new_content.replace(old, new)
        
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            total_files_changed += 1
            total_replacements += file_replacements
            rel_path = os.path.relpath(filepath, ROOT)
            print(f"Updated {rel_path} ({file_replacements} replacements)")

print(f"\nDone! Updated {total_files_changed} files with {total_replacements} total replacements.")
