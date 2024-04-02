# Use the OpenResty image as the base
FROM openresty/openresty:latest

# Remove the default Nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf

# Create the nginx log directory and set permissions
RUN mkdir -p /var/log/nginx && \
    chown -R www-data:www-data /var/log/nginx


# Copy the custom Nginx configuration file into the container
COPY proxy/nginx.conf /usr/local/openresty/nginx/conf/nginx.conf

# Copy the main.lua modifier
COPY proxy/modifiers /usr/local/openresty/nginx/modifiers

# Copy the dom3d.js script
COPY src/dom3d.js /usr/local/openresty/nginx/scripts/dom3d.js

# Redirect Nginx Logs to stdout/stderr
RUN ln -sf /dev/stdout /var/log/nginx/access.log \
 && ln -sf /dev/stderr /var/log/nginx/error.log

# Expose port 80 to the host
EXPOSE 80

# Start OpenResty (which includes Nginx) when the container launches
CMD ["/usr/local/openresty/bin/openresty", "-g", "daemon off;"]
