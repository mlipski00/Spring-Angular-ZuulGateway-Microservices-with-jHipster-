/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { SessionComponentsPage, SessionDeleteDialog, SessionUpdatePage } from './session.page-object';
import * as path from 'path';

const expect = chai.expect;

describe('Session e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let sessionUpdatePage: SessionUpdatePage;
    let sessionComponentsPage: SessionComponentsPage;
    let sessionDeleteDialog: SessionDeleteDialog;
    const fileNameToUpload = 'logo-jhipster.png';
    const fileToUpload = '../../../../../main/webapp/content/images/' + fileNameToUpload;
    const absolutePath = path.resolve(__dirname, fileToUpload);

    before(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load Sessions', async () => {
        await navBarPage.goToEntity('session');
        sessionComponentsPage = new SessionComponentsPage();
        expect(await sessionComponentsPage.getTitle()).to.eq('Sessions');
    });

    it('should load create Session page', async () => {
        await sessionComponentsPage.clickOnCreateButton();
        sessionUpdatePage = new SessionUpdatePage();
        expect(await sessionUpdatePage.getPageTitle()).to.eq('Create or edit a Session');
        await sessionUpdatePage.cancel();
    });

    it('should create and save Sessions', async () => {
        const nbButtonsBeforeCreate = await sessionComponentsPage.countDeleteButtons();

        await sessionComponentsPage.clickOnCreateButton();
        await promise.all([
            sessionUpdatePage.setTitleInput('title'),
            sessionUpdatePage.setDescriptionInput(absolutePath),
            sessionUpdatePage.setStartDateTimeInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
            sessionUpdatePage.setEndDateTimeInput('01/01/2001' + protractor.Key.TAB + '02:30AM')
        ]);
        expect(await sessionUpdatePage.getTitleInput()).to.eq('title');
        expect(await sessionUpdatePage.getDescriptionInput()).to.endsWith(fileNameToUpload);
        expect(await sessionUpdatePage.getStartDateTimeInput()).to.contain('2001-01-01T02:30');
        expect(await sessionUpdatePage.getEndDateTimeInput()).to.contain('2001-01-01T02:30');
        await sessionUpdatePage.save();
        expect(await sessionUpdatePage.getSaveButton().isPresent()).to.be.false;

        expect(await sessionComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
    });

    it('should delete last Session', async () => {
        const nbButtonsBeforeDelete = await sessionComponentsPage.countDeleteButtons();
        await sessionComponentsPage.clickOnLastDeleteButton();

        sessionDeleteDialog = new SessionDeleteDialog();
        expect(await sessionDeleteDialog.getDialogTitle()).to.eq('Are you sure you want to delete this Session?');
        await sessionDeleteDialog.clickOnConfirmButton();

        expect(await sessionComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    });

    after(async () => {
        await navBarPage.autoSignOut();
    });
});
