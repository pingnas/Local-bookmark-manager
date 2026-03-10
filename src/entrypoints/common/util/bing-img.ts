export const useBingImage = () => {
    const data = ref();
    const loading = ref(true);
    const error = ref(null);

    onMounted(() => {
        chrome.runtime.sendMessage({ action: "getBingImage" }, (response) => {
            loading.value = false;
            if (response.success) {
                data.value = `https://www.bing.com${response.data.images[0].url}`;
            } else {
                error.value = response.error;
            }
        });
    });

    return { data, loading, error };
};