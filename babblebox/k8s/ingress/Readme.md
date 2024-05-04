
### Install ingress-nginx
The values.yml file tells it to create an elb for the controller. 
    ```
        kubectl create namespace nginx
        helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx


        helm install ingress-nginx ingress-nginx/ingress-nginx \
            --version 4.10.1 \
            --namespace nginx \
            --values ingress-nginx-values.yml
    ```


### Create 2 cert issuers using cert-manager already installed using cdk. 
