-- Import the dom3d.js file to inject it
local file_path = "/usr/local/openresty/nginx/scripts/dom3d.js";
local script = ""
local f = io.open(file_path, "r")
script = f:read("*all")
f:close()

-- Remove the export statement
script = string.gsub(script, "export ", "")

-- Replace % with %% to avoid string.format issues
script = string.gsub(script, "%%", "%%%%")

local html = ngx.arg[1]

-- Default settings
local showSides = false
local colorSurfaces = true
local colorRandom = false
local requireDrag = true
local requireAlt = false

local run_dom3d_script = [[
	window.addEventListener('load', function() {
		dom3d(
			]] .. tostring(showSides) .. [[,
			]] .. tostring(colorSurfaces) .. [[,
			]] .. tostring(colorRandom) .. [[,
			]] .. tostring(requireDrag) .. [[,
			]] .. tostring(requireAlt) .. [[,
            [], // CSS Selectors
		);
	});
]]

local js_to_inject = [[
    <script>
]] .. script .. "\n\n" .. run_dom3d_script .. [[
    </script>
]]

html = string.gsub(html, "</body>", js_to_inject .. "</body>")

ngx.arg[1] = html
