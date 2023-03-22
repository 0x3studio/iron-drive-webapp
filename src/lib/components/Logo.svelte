<script lang="ts">
  export let size: string = "normal";

  let width: number;
  let height: number;

  switch (size) {
    case "large": {
      width = 158;
      height = 38;
      break;
    }
    default: {
      width = 79;
      height = 19;
    }
  }
</script>

<svg
  {width}
  {height}
  viewBox="0 0 79 19"
  fill="currentColor"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    fill-rule="evenodd"
    clip-rule="evenodd"
    d="M22 19.0009H16L16 1.00095H22V7.19536V19.0009Z"
    fill="black"
  />
  <path
    d="M31 1.16548V8.00095H23C23.1948 6.68583 23.515 5.55728 23.9607 4.61529C24.5381 3.41059 25.3079 2.51098 26.2701 1.91646C27.6372 1.07184 29.4474 0.78682 31 1.16548Z"
    fill="black"
  />
  <circle cx="47" cy="10" r="9" fill="black" />
  <rect y="1" width="6" height="18" fill="black" />
  <path
    fill-rule="evenodd"
    clip-rule="evenodd"
    d="M63 0.929311V18.9293H79L79 5.9293C79 3.16788 76.7614 0.929307 74 0.929307L63 0.929311Z"
    fill="black"
  />
  <path
    fill-rule="evenodd"
    clip-rule="evenodd"
    d="M66 1V19H71L71 5.99999C71 3.23857 68.7614 1 66 1Z"
    fill="black"
  />
</svg>

<style>
</style>
