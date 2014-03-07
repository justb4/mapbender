<?php
namespace Mapbender\CoreBundle\Template;

use Mapbender\CoreBundle\Component\Template;

/**
 * Template Classic
 */
class Classic extends Template
{
    /**
     * @inheritdoc
     */
    public static function getRegionsProperties()
    {
        return array(
            'sidepane' => array(
                'tabs' => array(
                    'state' => true,
                    'options' => array('icon' => 'XXX')
                )
            )
        );
    }

    /**
     * @inheritdoc
     */
    public static function getTitle()
    {
        return 'Classic template';
    }

    /**
     * @inheritdoc
     */
    static public function listAssets()
    {
        $assets = array(
            'css' => array(), // '@FOMCoreBundle/Resources/public/css/frontend/classic.css'
            'js' => array('@FOMCoreBundle/Resources/public/js/widgets/popup.js',
                '@FOMCoreBundle/Resources/public/js/frontend/sidepane.js',
                '@FOMCoreBundle/Resources/public/js/frontend/tabcontainer.js'),
            'trans' => array()
        );
        return $assets;
    }

    /**
     * @inheritdoc
     */
    public function getAssets($type)
    {
        $assets = $this::listAssets();
        return $assets[$type];
    }

    /**
     * @inheritdoc
     */
    public static function getRegions()
    {
        return array('toolbar', 'sidepane', 'content', 'footer');
    }

    /**
     * @inheritdoc
     */
    public function render($format = 'html', $html = true, $css = true,
        $js = true)
    {
        $region_props = $this->application->getEntity()->getNamedRegionProperties();
        $default_region_props = $this->getRegionsProperties();

        $templating = $this->container->get('templating');
        return $templating
                ->render('MapbenderCoreBundle:Template:classic.html.twig',
                    array(
                    'html' => $html,
                    'css' => $css,
                    'js' => $js,
                    'application' => $this->application,
                    'region_props' => $region_props,
                    'default_region_props' => $default_region_props));
    }

}
