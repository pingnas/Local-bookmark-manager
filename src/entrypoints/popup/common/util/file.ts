import dayjs from "dayjs";

export const getBackupFolderName = () => {
    let now = dayjs();
    return `backup ${now.get('year')}年 ${now.get('month') + 1}月 ${now.get('date')}日 ${now.get('hour')}时 ${now.get('minute')}分 ${now.get('second')}秒`;
}

export const saveAsJson = (obj: { [k: string]: any }, name: string = 'Local bookmark manager historyGroup ' + getBackupFolderName()) => {
    let str = JSON.stringify(obj)
    const blob = new Blob([str], { type: "application/json;charset=utf-8" });
    const href = URL.createObjectURL(blob);
    const alink = document.createElement("a");
    alink.style.display = "none";
    alink.download = `${name}.json`;
    alink.href = href;
    document.body.appendChild(alink);
    alink.click();
    document.body.removeChild(alink);
    URL.revokeObjectURL(href);
}

export const readFromJson = async (file: File) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            const contents = e.target?.result;
            if (contents)
                try {
                    const jsonData = JSON.parse(contents as any);
                    resolve(jsonData);
                } catch (e) {
                    reject(`Error parsing JSON file: ${e}`,);
                }
        };
        reader.readAsText(file);
    })
}

export const readFromImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            const code = e.target?.result as string;
            if (code)
                try {
                    resolve(code);
                } catch (e) {
                    reject(`Error parsing JSON file: ${e}`,);
                }

        };
        reader.readAsDataURL(file);
    })
}
