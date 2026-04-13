import os

replacements = {
    "@/store/useUserStore": "@/store/StoreProvider",
    "@/store/useMarketStore": "@/store/StoreProvider",
    "@/store/useUIStore": "@/store/StoreProvider",
    "@/store/AppStoreProvider": "@/store/StoreProvider"
}

def process_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = content
        for old, new in replacements.items():
            new_content = new_content.replace(old, new)
        
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated: {filepath}")
    except Exception as e:
        print(f"Error processing {filepath}: {e}")

def main():
    skip_files = [
        "StoreProvider.tsx",
        "useAppStore.ts", 
        "useUserStore.ts", 
        "useMarketStore.ts", 
        "useUIStore.ts"
    ]
    
    for root, dirs, files in os.walk('src'):
        for file in files:
            if (file.endswith('.ts') or file.endswith('.tsx')) and file not in skip_files:
                process_file(os.path.join(root, file))

if __name__ == "__main__":
    main()
