(function () {
  const fileInput = document.getElementById("upload");
  const previewImage = document.getElementById("preview");
  const previewWrapper = document.getElementById("previewWrapper");
  const downloadLink = document.getElementById("download");
  const uploadZone = document.getElementById("uploadZone");
  const resetBtn = document.getElementById("resetBtn");

  fileInput.accept = "image/*";

  fileInput.addEventListener("click", function (e) {
    e.stopPropagation();
  });

  fileInput.addEventListener("change", function (e) {
    e.preventDefault();

    const file = this.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("لطفاً فقط فایل تصویری انتخاب کنید.");
      this.value = "";
      return;
    }

    convertImage(file);
    this.value = "";
  });

  function convertImage(file) {
    const reader = new FileReader();
    reader.onload = function (ev) {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          function (blob) {
            if (!blob) return;
            const url = URL.createObjectURL(blob);

            downloadLink.href = url;
            downloadLink.classList.add("show");
            resetBtn.classList.add("show");

            previewImage.src = url;
            previewWrapper.classList.add("show");

            uploadZone.classList.add("hidden");

            downloadLink.innerHTML = `
            <svg viewBox="0 0 20 20" width="22" height="22">
              <path d="M10 1L10 13M10 13L6 9M10 13L14 9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 17L18 17" stroke="white" stroke-width="2" stroke-linecap="round"/>
            </svg>
            دریافت WebP
          `;
          },
          "image/webp",
          0.9,
        );
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }

  uploadZone.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (!uploadZone.classList.contains("hidden")) {
      fileInput.click();
    }
  });

  resetBtn.addEventListener("click", function () {
    uploadZone.classList.remove("hidden");
    previewWrapper.classList.remove("show");
    downloadLink.classList.remove("show");
    resetBtn.classList.remove("show");

    previewImage.src = "";
    downloadLink.href = "";
    fileInput.value = "";

    document
      .querySelector(".webp-card")
      .scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
})();
