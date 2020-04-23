echo -e "\033[0;31mMake ensure Hilo3d is in master branch !\033[0;37m"
select yn in "Yes" "No"; do
    case $yn in
        Yes ) Go on; break;;
        No ) exit 1;;
    esac
done

npm run build
