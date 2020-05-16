const cheerio = require('cheerio');
const fs = require('fs');
const https = require('https');

const saveImageToDisk = (url, localPath) => {
    https.get(url, function (res) {
        let imagedata = '';
        res.setEncoding('binary');

        res.on('data', chunk => {
            imagedata += chunk;
        });

        res.on('end', () => {
            fs.writeFile(localPath, imagedata, 'binary', function (err) {
                if (err) throw err;
            });
        });
    });
};

const parser = scrape => {
    const $ = cheerio.load(scrape);
    // const image = $('.top-card-layout__card img').attr('src');
    // saveImageToDisk(image, './public/images/me.jpg');
    const name = $('.top-card-layout__title').text();
    const headline = $('.top-card-layout__headline').text();
    const location = $('.top-card__subline-item').text();

    const aboutHeading = $('.summary__heading').text();
    const aboutContent = $('.summary p').html();

    const experienceHeading = $('.experience__heading').text();
    const experienceArray = [];
    const experienceItems = $('li.experience-item');
    experienceItems.each(function (i, elem) {
        const companyLogoUrl = $(this).find('img').attr('data-delayed-url');
        companyLogoUrl.includes('company-logo') &&
            saveImageToDisk(companyLogoUrl, `./public/images/experience/${i}.jpg`);
        if (elem.attribs.class.includes('experience-group')) {
            const company = $(this).find('.experience-group-header__company').text();
            const date = $(this).find('.experience-group-header__duration').text();
            const experienceGroupArray = [];
            const experienceGroupItems = $('.result-card.experience-group-position');
            experienceGroupItems.each(function (i) {
                const experienceTitle = $(this).find('.experience-group-position__title').text();
                const dateStart = $(this).find('.date-range__start-date').text();
                const dateEnd = $(this).find('.date-range__end-date').text();
                const date = `${dateStart}${dateEnd ? ' - ' + dateEnd : ' - Present'}`;
                const duration = $(this).find('.date-range__duration').text();
                const showLess = $(this).find('p.show-more-less-text__text--less').html();
                const showMore = $(this).find('p.show-more-less-text__text--more').html();
                const description = showMore !== null ? showMore : showLess;
                experienceGroupArray.push({
                    experienceTitle,
                    duration,
                    date,
                    description,
                });
            });
            experienceArray.push({
                company,
                date,
                experienceGroupArray,
            });
        } else {
            const experienceTitle = $(this).find('.experience-item__title').text();
            const company = $(this).find('.experience-item__subtitle-link').text();
            const dateStart = $(this).find('.date-range__start-date').text();
            const dateEnd = $(this).find('.date-range__end-date').text();
            const date = `${dateStart}${dateEnd ? ' - ' + dateEnd : ' - Present'}`;
            const duration = $(this).find('.date-range__duration').text();
            const location = $(this).find('.experience-item__location').text();
            const showLess = $(this).find('p.show-more-less-text__text--less').html();
            const showMore = $(this).find('p.show-more-less-text__text--more').html();
            const description = showMore !== null ? showMore : showLess;
            experienceArray.push({
                experienceTitle,
                company,
                date,
                duration,
                location,
                description,
            });
        }
    });

    const educationHeading = $('.education__heading').text();
    const educationArray = [];
    const educationItems = $('.education__list .result-card');
    educationItems.each(function (i, elem) {
        const educationLogoUrl = $(this).find('img').attr('data-delayed-url');
        educationLogoUrl.includes('company-logo') &&
            saveImageToDisk(educationLogoUrl, `./public/images/education/${i}.jpg`);
        const school = $(this).find('.result-card__title').text();
        const degree = $(this).find('.result-card__subtitle').text();
        const field = $(this).find('.education__item education__item--degree-info').text();
        const time = $(this).find('.education__item education__item--duration').html();
        const society = $(this)
            .find('.education__item education__item--activities-and-societies')
            .text();
        const showLess = $(this).find('p.show-more-less-text__text--less').html();
        const showMore = $(this).find('p.show-more-less-text__text--more').html();
        const curriculum = showMore !== null ? showMore : showLess;
        educationArray.push({
            school,
            degree,
            field,
            time,
            society,
            curriculum,
        });
    });

    const certificationsHeading = $('.certifications__heading').text();
    const certificationsArray = [];
    const certificationsItems = $('.certifications__list .result-card');
    certificationsItems.each(function (i, elem) {
        const certificationsLogoUrl = $(this).find('img').attr('data-delayed-url');
        certificationsLogoUrl.includes('company-logo') &&
            saveImageToDisk(certificationsLogoUrl, `./public/images/certifications/${i}.jpg`);
        const certification = $(this).find('.result-card__title-link').text();
        const subtitle = $(this).find('.result-card__subtitle').text();
        const credetials = $(this).find('.certifications__credential-id').text();

        certificationsArray.push({
            certification,
            subtitle,
            credetials,
        });
    });

    const languagesHeading = $('.languages__heading').text();
    const languagesArray = [];
    const languagesItems = $('.languages__list .result-card');
    languagesItems.each(function (i, elem) {
        const language = $(this).find('.result-card__title').text();
        const proficiency = $(this).find('.result-card__subtitle').text();

        languagesArray.push({
            language,
            proficiency,
        });
    });

    return {
        name,
        headline,
        location,
        about: {
            aboutHeading,
            aboutContent,
        },
        experience: {
            experienceHeading,
            experienceArray,
        },
        education: {
            educationHeading,
            educationArray,
        },
        certifications: {
            certificationsHeading,
            certificationsArray,
        },
        languages: {
            languagesHeading,
            languagesArray,
        },
    };
};

module.exports = parser;
