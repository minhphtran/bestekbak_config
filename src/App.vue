<template>
  <div id="config-app">
	<header>
  		<nav class="header-title"> 
			<a href="https://github.com/minhphtran/bestekbak_config" target="_blank">
				<svg width=15 viewBox="0 0 56.35 61.82" preserveAspectRatio="xMidYMid slice" role="img"><g id="Layer_1-2" data-name="Layer 1"><path d="m1.88,43.74c8.88.91,17.54,2.54,25.97,4.87,8.43,2.34,16.6,5.44,24.52,9.31,1.25.34,1.82,1.17,1.71,2.48-.17,1.14-.97,1.59-2.39,1.37-16.18-7.69-32.72-12.39-49.63-14.1-1.37-.28-2.05-.91-2.05-1.88,0-1.08.63-1.76,1.88-2.05ZM7.43,0c8.03,1.2,16.02,2.69,23.96,4.48s15.79,3.92,23.54,6.36c1.14.8,1.59,1.62,1.37,2.48-.29.97-1.03,1.4-2.22,1.28-7.69-2.39-15.42-4.48-23.19-6.28-7.77-1.79-15.59-3.26-23.45-4.4-1.65,0-2.48-.65-2.48-1.96-.12-1.25.71-1.91,2.48-1.96Zm1.88,21.87c12.99,1.88,25.94,5.04,38.87,9.48,1.31.46,1.88,1.17,1.71,2.14-.17,1.03-.88,1.6-2.14,1.71-12.81-4.38-25.74-7.46-38.78-9.23-1.25-.46-1.85-1.22-1.79-2.31.11-1.14.83-1.74,2.14-1.79Z" style="fill: #231f20;"/></g></svg>
				Bestekbak Configurator 
				<svg width=15 viewBox="0 0 56.35 61.82" preserveAspectRatio="xMidYMid slice" role="img"><g id="Layer_1-2" data-name="Layer 1"><path d="m1.88,43.74c8.88.91,17.54,2.54,25.97,4.87,8.43,2.34,16.6,5.44,24.52,9.31,1.25.34,1.82,1.17,1.71,2.48-.17,1.14-.97,1.59-2.39,1.37-16.18-7.69-32.72-12.39-49.63-14.1-1.37-.28-2.05-.91-2.05-1.88,0-1.08.63-1.76,1.88-2.05ZM7.43,0c8.03,1.2,16.02,2.69,23.96,4.48s15.79,3.92,23.54,6.36c1.14.8,1.59,1.62,1.37,2.48-.29.97-1.03,1.4-2.22,1.28-7.69-2.39-15.42-4.48-23.19-6.28-7.77-1.79-15.59-3.26-23.45-4.4-1.65,0-2.48-.65-2.48-1.96-.12-1.25.71-1.91,2.48-1.96Zm1.88,21.87c12.99,1.88,25.94,5.04,38.87,9.48,1.31.46,1.88,1.17,1.71,2.14-.17,1.03-.88,1.6-2.14,1.71-12.81-4.38-25.74-7.46-38.78-9.23-1.25-.46-1.85-1.22-1.79-2.31.11-1.14.83-1.74,2.14-1.79Z" style="fill: #231f20;"/></g></svg>
			</a>
			<p class="header-subtitle"><a href="https://minhphtran.github.io/" target="_blank"><i> trial built by Minh </i></a></p>
		</nav>
	</header>
    <section class="config-container">
      <config-grid/>
      <config-form/>
    </section>
  </div>
</template>

<script>
import ConfigGrid from "./components/ConfigGrid.vue";
import ConfigForm from "./components/ConfigForm.vue";

export default {
  name: 'App',
  components: {
    ConfigGrid,
    ConfigForm,
  },
  created() {
    this.$store.commit("iniArr", window.location.search);
  }
}
</script>

<style>
* {
	 box-sizing: border-box;
}
 *, *::before, *::after {
	 box-sizing: inherit;
}
 *:focus {
    outline: none;
}
 body {
	 width: 100%;
	 height: 90vh;
	 padding: 0;
	 margin: 0;
	 background: #f0f0f0;
	 font-family: ui-sans-serif, system-ui;
	 -webkit-font-smoothing: antialiased;
	 -moz-osx-font-smoothing: grayscale;
	 color: #161825;
	 font-weight: 300;
}
 .config-container {
  display: flex;
}
.header-title {
	font-size: 25px;
    font-weight: 700;
    margin-top: 30px;
    margin-bottom: 40px;
    text-align: center;
}

a {
	text-decoration: none;
	color: #161825;
}

a:hover {
	color: #8D7B68;
}

.header-subtitle{
	font-size: 15px;
    font-weight: 500;
}

@media screen and (max-width: 700px) {
  .config-container {
    flex-direction: column;
  }
}

 button {
	 background: transparent;
	 color: #131321;
	 padding: 4px 30px 5px;
	 border-radius: 1000px;
	 border: 1px solid #131321;
	 font-size: 16px;
	 margin: 20px 0 0;
	 cursor: pointer;
	 transition: 0.35s all;
   display:block;
}
 button:hover {
	 background: #444444;
	 color: #f0f0f0;
	 border: none;
}


</style>
