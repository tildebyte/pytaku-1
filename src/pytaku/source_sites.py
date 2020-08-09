from mangoapi import get_site_class

from .conf import config

"""
This module adapts mangoapi's API to a more convenient one for app-wide use.
States are all handled here, exposing only a functional API to the rest of the app.
"""

_site_objs = {}


def _get_site(name):
    global _site_objs
    site = _site_objs.get(name)
    if not site:
        site_class = get_site_class(name)
        assert site_class is not None
        site = site_class()
        if name == "mangadex":
            site.username = config.MANGADEX_USERNAME
            site.password = config.MANGADEX_PASSWORD
    return site


def get_chapter(site_name, chapter_id):
    return _get_site(site_name).get_chapter(chapter_id)


def get_title(site_name, title_id):
    return _get_site(site_name).get_title(title_id)


def search_title(site_name, query):
    return _get_site(site_name).search_title(query)


def search_title_all_sites(query):
    """
    Returns dict in the form of {site_name: List[Title]}
    I should really look into proper type annotations huh.
    """
    return {
        site_name: search_title(site_name, query)
        for site_name in ("mangasee", "mangadex")
    }
